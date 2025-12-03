import { GAME_CONFIG } from '../domain/GameConfig';
import { GameConfig, Phase, } from '../domain/GameConfig';
import { Question, QUESTIONS } from '../domain/Questions';
import { ScoreSystem } from '../domain/ScoreSystem';
import { Motivator, TrophyMotivator } from '../ui/motivators';
import { TimerService } from '../domain/TimerService';
import { UIRenderer } from '../ui/domRenderer';
import { PerformanceTracker } from '../domain/PerformanceTracker';


/**
 * Coordinates question flow, scoring, timer updates, and UI callbacks.
 */
export class GameController {
  private readonly config: GameConfig;
  private readonly scoreSystem: ScoreSystem;
  private readonly performanceTracker: PerformanceTracker;
  private readonly motivator: Motivator;
  private readonly timer: TimerService;
  private readonly ui: UIRenderer;
  private readonly now: () => number;

  private tickIntervalId: number | null = null;

  private questions: Question[];
  private currentIndex = 0;
  private currentPhase: Phase = 'LEARN';
  private gameOver = false;
  private questionCompleted = false;
  private lastSampleTimestamp = 0;
  private timeAboveThresholdMs = 0;
  //private lastDecayTimestamp = 0;
  private nextQuestionTimeoutId: number | null = null;
  private readonly postAnswerDelayMs = 700;
  private currentQuestionTrackedMs = 0;

  constructor() {
    this.ui = new UIRenderer({
      onAnswerSelected: (optionId) => this.answerCurrent(optionId),
      onSkipLearn: () => this.skipLearnPhase(),
    });
    this.config = GAME_CONFIG;
    this.now = (() => Date.now());
    this.questions = QUESTIONS;
    this.scoreSystem = new ScoreSystem(this.config);
    this.motivator = new TrophyMotivator();
    this.timer = new TimerService(this.config.secondsPerQuestion, this.now);
    this.performanceTracker = new PerformanceTracker(this.config);

    if (!this.questions.length) {
      throw new Error('GameSession requires at least one question.');
    }
  }

  start(): void {
    this.clearPendingNextQuestion();
    this.currentIndex = 0;
    this.currentPhase = 'LEARN';
    this.gameOver = false;
    this.questionCompleted = false;
    this.currentQuestionTrackedMs = 0;
    this.resetTimeTracking();
    //this.lastDecayTimestamp = this.now();
    this.timer.startQuestion();
    this.pushQuestionToUI();
    this.startTickLoop();
  }

  stop(): void {
    if (this.tickIntervalId !== null) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }

  private startTickLoop(): void {
    this.stop();
    this.tickIntervalId = window.setInterval(() => {
      this.tickTimerUI();
      if (this.isGameOver()) {
        this.stop();
      }
    }, 50);
  }

  answerCurrent(optionId: number): void {
    if (this.gameOver || this.questionCompleted) {
      return;
    }
    this.trackTimeSample();

    const question = this.questions[this.currentIndex];
    if (!question) {
      return;
    }

    const answeredInTime = this.timer.hasTimeLeft();
    const isCorrect = answeredInTime && question.correctOptionId === optionId;

    this.scoreSystem.applyAnswer(isCorrect, this.currentPhase);
    this.ui.updateScore(this.scoreSystem.getScorePercent());
    this.ui.updateMotivator(this.scoreSystem.getScorePercent());
    this.motivator.render(this.scoreSystem.getScorePercent());

    this.questionCompleted = true;
    this.ui.showCorrectAnswerIndex(question.correctOptionId);
    this.finalizeQuestionTime();

    if (this.scoreSystem.isImmediateLoss()) {
      this.endGame(false);
      return;
    }

    this.scheduleNextQuestion();
  }

  nextQuestion(): void {
    if (this.gameOver) {
      return;
    }
    this.clearPendingNextQuestion();
    this.trackTimeSample();

    this.currentIndex += 1;
    if (this.currentIndex >= this.questions.length) {
      if (this.currentPhase === 'LEARN') {
        this.currentPhase = 'TEST';
        this.currentIndex = 0;
      } else {
        const won =
          this.getTimeAboveThresholdFraction() >= this.config.requiredScoreAboveThresholdFraction;
        this.endGame(won);
        return;
      }
    }

    this.questionCompleted = false;
    this.currentQuestionTrackedMs = 0;
    this.timer.startQuestion();
    //this.lastDecayTimestamp = this.now();
    this.lastSampleTimestamp = this.now();
    this.pushQuestionToUI();
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  getTimeAboveThresholdFraction(): number {
    const fullTestDurationMs = this.toMilliSeconds(this.questions.length * this.config.secondsPerQuestion);
    if (fullTestDurationMs === 0) {
      return 0;
    }
    return Math.min(1, this.timeAboveThresholdMs / fullTestDurationMs);
  }

  toSeconds(milliseconds: number): number {
    return milliseconds / 1000;
  }

  toMilliSeconds(seconds: number): number {
    return seconds * 1000;
  }

  skipLearnPhase(): void {
    if (this.gameOver || this.currentPhase === 'TEST') {
      return;
    }
    this.clearPendingNextQuestion();
    this.currentPhase = 'TEST';
    this.currentIndex = 0;
    this.questionCompleted = false;
    this.currentQuestionTrackedMs = 0;
    this.lastSampleTimestamp = this.now();
    this.timer.startQuestion();
    //this.lastDecayTimestamp = this.now();
    this.pushQuestionToUI();
  }

  tickTimerUI(): void {
    this.trackTimeSample();
    this.pushTimeAboveToUI();

    const now = this.now();
    //const decayDeltaSeconds = this.toSeconds(now - this.lastDecayTimestamp);
    //this.lastDecayTimestamp = now;

    // kontinuierlicher Punkteabzug nur in der Prüfphase
    if (!this.gameOver && !this.questionCompleted && this.currentPhase === 'TEST') {
      //this.scoreSystem.applyTimeDecay(decayDeltaSeconds, this.currentPhase);
      this.ui.updateScore(this.scoreSystem.getScorePercent());
      this.ui.updateMotivator(this.scoreSystem.getScorePercent());
      this.motivator.render(this.scoreSystem.getScorePercent());

      if (this.scoreSystem.isImmediateLoss()) {
        this.endGame(false);
        return;
      }
    }

    const remainingTime = this.timer.getRemainingSeconds();
    this.ui.updateTimer(remainingTime, this.timer.getRemainingFraction());

    if (remainingTime === 0 && !this.gameOver && !this.questionCompleted) {
      // Timeout ohne Antwort: wie falsche Antwort werten
      const question = this.questions[this.currentIndex];
      this.scoreSystem.applyAnswer(false, this.currentPhase);
      this.ui.updateScore(this.scoreSystem.getScorePercent());
      this.ui.updateMotivator(this.scoreSystem.getScorePercent());
      this.motivator.render(this.scoreSystem.getScorePercent());

      this.questionCompleted = true;
      if (question) {
        this.ui.showCorrectAnswerIndex(question.correctOptionId);
      }
      this.finalizeQuestionTime();

      if (this.scoreSystem.isImmediateLoss()) {
        this.endGame(false);
        return;
      }

      this.scheduleNextQuestion();
    }
  }

  private pushQuestionToUI(): void {
    const question = this.questions[this.currentIndex];
    this.ui.showQuestion(question);
    this.ui.updateQuestionIndex(this.currentIndex + 1, this.questions.length);
    this.ui.updatePhase(this.currentPhase);
    this.ui.updateTimer(this.timer.getRemainingSeconds(), this.timer.getRemainingFraction());
    this.ui.updateScore(this.scoreSystem.getScorePercent());
    this.ui.updateMotivator(this.scoreSystem.getScorePercent());
    this.pushTimeAboveToUI();
  }

  private endGame(won: boolean): void {
    this.trackTimeSample();
    this.finalizeQuestionTime();
    this.clearPendingNextQuestion();
    this.gameOver = true;
    this.ui.showGameOver(won);
    this.motivator.renderGameOver(won);
  }

  private trackTimeSample(): void {
    const now = this.now();
    if (!this.lastSampleTimestamp) {
      this.lastSampleTimestamp = now;
      return;
    }

    const timeSinceLastCall = now - this.lastSampleTimestamp;
    const questionDurationMs = this.toMilliSeconds(this.config.secondsPerQuestion);

    if (timeSinceLastCall > 0 && this.currentPhase === 'TEST' && !this.questionCompleted) {
      const remainingTimeForQuestion = Math.max(0, questionDurationMs - this.currentQuestionTrackedMs);
      const timeClamped = Math.min(timeSinceLastCall, remainingTimeForQuestion);
      if (timeClamped > 0) {
        this.currentQuestionTrackedMs += timeClamped;
        this.performanceTracker.changePerformanceScore(timeClamped, this.scoreSystem.getScorePercent(), this.currentQuestionTrackedMs);
      }
    }

    this.lastSampleTimestamp = now;
  }

  private resetTimeTracking(): void {
    this.timeAboveThresholdMs = 0;
    this.lastSampleTimestamp = this.now();
  }

  private pushTimeAboveToUI(): void {
    const secondsAbove = this.toSeconds(this.timeAboveThresholdMs);
    const fraction = this.getTimeAboveThresholdFraction();
    this.ui.updateTimeAbove(secondsAbove, fraction);
  }

  private scheduleNextQuestion(): void {
    this.clearPendingNextQuestion();
    this.nextQuestionTimeoutId = window.setTimeout(() => {
      this.nextQuestionTimeoutId = null;
      this.nextQuestion();
    }, this.postAnswerDelayMs);
  }

  private clearPendingNextQuestion(): void {
    if (this.nextQuestionTimeoutId !== null) {
      clearTimeout(this.nextQuestionTimeoutId);
      this.nextQuestionTimeoutId = null;
    }
  }

  private finalizeQuestionTime(): void {
    if (this.currentPhase !== 'TEST') {
      return;
    }
    const questionDurationMs = this.toMilliSeconds(this.config.secondsPerQuestion);
    const remainingMs = Math.max(0, questionDurationMs - this.currentQuestionTrackedMs);
    if (remainingMs === 0) {
      return;
    }
    if (this.scoreSystem.getScorePercent() >= this.config.winScoreThresholdPercent) {
      this.timeAboveThresholdMs += remainingMs;
    }
    this.currentQuestionTrackedMs += remainingMs;
  }
}
