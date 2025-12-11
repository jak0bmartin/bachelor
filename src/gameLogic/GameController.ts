import { GAME_CONFIG } from '../data/GameConfig';
import { GameConfig, Phase, GameMode } from '../data/GameConfig';
import { Question, QUESTIONS } from '../data/Questions';
import { ScoreSystem } from './ScoreSystem';
import { TimerService } from './TimerService';
import { DomView } from '../ui/DomView';
import { PerformanceTracker } from './PerformanceTracker';


/**
 * Coordinates question flow, scoring, timer updates, and UI callbacks.
 */
export class GameController {
  private readonly config: GameConfig;
  private readonly scoreSystem: ScoreSystem;
  private readonly performanceTracker: PerformanceTracker;
  private readonly timer: TimerService;
  private readonly ui: DomView;
  private readonly now: () => number;
  private readonly BLUR_TIME_MS = 3000;

  private tickIntervalId: number | null = null;

  private questions: Question[];
  private currentQuestionIndex = 0;
  private currentPhase: Phase = 'LEARN';
  private gameOver = false;
  private questionCompleted = false;
  private lastSampleTimestamp = 0;
  private mode: GameMode = GameMode.TROPHY;
  private lastDecayTimestamp = 0;
  private currentQuestionTrackedMs = 0;

  private pausedUntil = 0;
  private blurTimeoutId: number | null = null;

  constructor() {
    this.ui = new DomView();
    this.ui.setAnswerHandler((optionId) => this.answerCurrent(optionId));
    this.ui.onSkipLearn = () => this.skipLearnPhase();
    this.ui.onGameModeSelected = (mode: GameMode) => {
      this.mode = mode;
      this.ui.renderGameShell(mode);
      this.start();
    };
    this.config = GAME_CONFIG;
    this.now = (() => Date.now());
    this.questions = QUESTIONS;
    this.scoreSystem = new ScoreSystem(this.config);
    this.timer = new TimerService(this.config.secondsPerQuestion, this.now);
    this.performanceTracker = new PerformanceTracker(this.config);

    if (!this.questions.length) {
      throw new Error('GameSession requires at least one question.');
    }
  }

  start(): void {
    this.currentQuestionIndex = 0;
    this.currentPhase = 'LEARN';
    this.gameOver = false;
    this.questionCompleted = false;
    this.currentQuestionTrackedMs = 0;
    this.resetTimeTracking();
    this.lastDecayTimestamp = this.now();
    this.timer.startQuestionTimer();
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
        this.endGame();
        this.stop();
      }
    }, 50);
  }

  answerCurrent(optionId: number): void {
    if (this.gameOver || this.questionCompleted) {
      return;
    }
    if(!this.gameOver)this.blur();
    this.trackTimeSample();

    const question = this.questions[this.currentQuestionIndex];
    if (!question) {
      return;
    }

    const answeredInTime = this.timer.hasTimeLeft();
    const isCorrect = answeredInTime && question.correctOptionId === optionId;

    if(!isCorrect) this.performanceTracker.removeTimeAbove(10000);

    this.scoreSystem.applyAnswer(isCorrect, this.currentPhase);
    this.ui.renderScore(this.scoreSystem.getScorePercent());
    this.ui.renderMotivator(this.performanceTracker.getPerformanceScore(), this.mode);

    this.questionCompleted = true;
    this.ui.renderCorrectAnswerIndex(question.correctOptionId);
    this.finalizeQuestionTime();

    if (this.scoreSystem.isImmediateLoss()) {
      this.endGame();
      return;
    }
    
    this.nextQuestion();
  }

  blur(): void{
    if (this.blurTimeoutId !== null) {
      clearTimeout(this.blurTimeoutId);
    }
    this.ui.renderBlurEffect();
    this.pausedUntil = this.now() + this.BLUR_TIME_MS;
    this.blurTimeoutId = window.setTimeout(() => {
      this.ui.renderBlurEffect();
      this.pausedUntil = 0;
      this.blurTimeoutId = null;
      this.timer.reStartQuesionTimer();
      this.pushQuestionToUI();
    }, this.BLUR_TIME_MS);
  }

  nextQuestion(): void {
    if (this.gameOver) {
      return;
    }
    this.trackTimeSample();

    this.currentQuestionIndex += 1;
    if (this.currentQuestionIndex >= this.questions.length) {
      if (this.currentPhase === 'LEARN') {
        this.currentPhase = 'TEST';
        this.currentQuestionIndex = 0;
      } else {
        this.endGame();
        return;
      }
    }

    this.questionCompleted = false;
    this.currentQuestionTrackedMs = 0;
    this.timer.startQuestionTimer();
    this.lastDecayTimestamp = this.now();
    this.lastSampleTimestamp = this.now();
    this.pushQuestionToUI();
  }

  isGameOver(): boolean {
    return this.gameOver;
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
    this.currentPhase = 'TEST';
    this.currentQuestionIndex = 0;
    this.questionCompleted = false;
    this.currentQuestionTrackedMs = 0;
    this.lastSampleTimestamp = this.now();
    this.timer.startQuestionTimer();
    this.lastDecayTimestamp = this.now();
    this.pushQuestionToUI();
  }

  tickTimerUI(): void {
    this.trackTimeSample();
    if(this.now() < this.pausedUntil){this.lastDecayTimestamp = this.now(); return;}
    this.pushTimeAboveToUI();

    const now = this.now();
    const decayDeltaSeconds = this.toSeconds(now - this.lastDecayTimestamp);
    this.lastDecayTimestamp = now;

    // kontinuierlicher Punkteabzug nur in der Prüfphase
    if (!this.gameOver && !this.questionCompleted && this.currentPhase === 'TEST') {
      this.scoreSystem.applyTimeDecay(decayDeltaSeconds, this.currentPhase);
      this.ui.renderScore(this.scoreSystem.getScorePercent());
      this.ui.renderMotivator(this.performanceTracker.getPerformanceScore(), this.mode);

      if (this.scoreSystem.isImmediateLoss()) {
        this.endGame();
        return;
      }
    }

    const remainingTime = this.timer.getRemainingSeconds();
    this.ui.renderTimer(remainingTime, this.timer.getRemainingFraction());

    if (remainingTime === 0 && !this.gameOver && !this.questionCompleted) {
      // Timeout ohne Antwort: wie falsche Antwort werten
      if(!this.gameOver)this.blur();
      const question = this.questions[this.currentQuestionIndex];
      this.scoreSystem.applyAnswer(false, this.currentPhase);
      this.ui.renderScore(this.scoreSystem.getScorePercent());
      this.ui.renderMotivator(this.performanceTracker.getPerformanceScore(), this.mode);

      this.performanceTracker.removeTimeAbove(10000);
      
      this.questionCompleted = true;
      if (question) {
        this.ui.renderCorrectAnswerIndex(question.correctOptionId);
      }
      this.finalizeQuestionTime();

      if (this.scoreSystem.isImmediateLoss()) {
        this.endGame();
        return;
      }

      this.nextQuestion();
    }
  }

  private pushQuestionToUI(): void {
    if(this.now() < this.pausedUntil ) return;
    const question = this.questions[this.currentQuestionIndex];
    this.ui.renderQuestion(question);
    this.ui.renderQuestionIndex(this.currentQuestionIndex + 1, this.questions.length);
    this.ui.renderPhase(this.currentPhase);
    this.ui.renderTimer(this.timer.getRemainingSeconds(), this.timer.getRemainingFraction());
    this.ui.renderScore(this.scoreSystem.getScorePercent());
    this.ui.renderMotivator(this.performanceTracker.getPerformanceScore(), this.mode);
    this.pushTimeAboveToUI();
  }

  private endGame(): void {
    this.gameOver = true;
    let won = false;
    if(this.performanceTracker.getTimeAboveThresholdFraction()*100 >= this.config.winScoreThresholdPercent) won = true;
    this.trackTimeSample();
    this.finalizeQuestionTime();
    this.ui.renderGameOver(won, this.mode);
  }

  private trackTimeSample(): void {
    const now = this.now();
    if(now < this.pausedUntil){ this.lastSampleTimestamp = now; return;}
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
    this.performanceTracker.reset();
    this.lastSampleTimestamp = this.now();
  }

  private pushTimeAboveToUI(): void {
    //let secondsAbove = this.toSeconds(this.timeAboveThresholdMs);
    let secondsAbove = this.toSeconds(this.performanceTracker.getPerformanceScoreSeconds());
    const fraction = this.performanceTracker.getTimeAboveThresholdFraction();
    this.ui.renderTimeAbove(secondsAbove, fraction);
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
      this.performanceTracker.addTimeAbove(remainingMs);
    }
    this.currentQuestionTrackedMs += remainingMs;
  }
}
