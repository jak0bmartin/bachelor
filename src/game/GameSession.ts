import { GAME_CONFIG, GameConfig, Phase, Question } from '../domain/GameConfig';
import { ScoreSystem } from '../domain/ScoreSystem';
import { Motivator, TrophyMotivator } from '../ui/motivators';
import { TimerService } from '../domain/TimerService';
import { UIRenderer } from '../ui/domRenderer';

type GameSessionOptions = {
  questions: Question[];
  config?: GameConfig;
  scoreSystem?: ScoreSystem;
  motivator?: Motivator;
  timer?: TimerService;
  ui?: UIRenderer;
  now?: () => number;
};

/**
 * Coordinates question flow, scoring, timer updates, and UI callbacks.
 */
export class GameSession {
  private readonly config: GameConfig;
  private readonly scoreSystem: ScoreSystem;
  private readonly motivator: Motivator;
  private readonly timer: TimerService;
  private readonly ui: UIRenderer;
  private readonly now: () => number;

  private questions: Question[];
  private currentIndex = 0;
  private currentPhase: Phase = 'LEARN';
  private gameOver = false;
  private lastSampleTimestamp = 0;
  private timeAboveThresholdMs = 0;
  private totalTrackedMs = 0;

  constructor(options: GameSessionOptions) {
    if (!options.questions.length) {
      throw new Error('GameSession requires at least one question.');
    }

    this.config = options.config ?? GAME_CONFIG;
    this.now = options.now ?? (() => Date.now());
    this.questions = options.questions;
    this.scoreSystem = options.scoreSystem ?? new ScoreSystem(this.config);
    this.motivator = options.motivator ?? new TrophyMotivator();
    this.timer =
      options.timer ??
      new TimerService(this.config.secondsPerQuestion, this.now);
    this.ui = options.ui ?? new UIRenderer();
  }

  start(): void {
    this.currentIndex = 0;
    this.currentPhase = 'LEARN';
    this.gameOver = false;
    this.resetTimeTracking();
    this.timer.startQuestion();
    this.pushQuestionToUI();
  }

  answerCurrent(optionId: number): void {
    if (this.gameOver) {
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

    if (this.scoreSystem.isImmediateLoss()) {
      this.endGame(false);
      return;
    }

    this.nextQuestion();
  }

  nextQuestion(): void {
    if (this.gameOver) {
      return;
    }
    this.trackTimeSample();

    this.currentIndex += 1;

    if (this.currentIndex >= this.questions.length) {
      if (this.currentPhase === 'LEARN') {
        this.currentPhase = 'TEST';
        this.currentIndex = 0;
      } else {
        const won = this.scoreSystem.getScorePercent() >= this.config.winThresholdPercent;
        this.endGame(won);
        return;
      }
    }

    this.timer.startQuestion();
    this.pushQuestionToUI();
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  getTimeAboveThresholdFraction(): number {
    if (this.totalTrackedMs === 0) {
      return 0;
    }
    return this.timeAboveThresholdMs / this.totalTrackedMs;
  }

  getTotalTrackedSeconds(): number {
    return this.totalTrackedMs / 1000;
  }

  private pushQuestionToUI(): void {
    const question = this.questions[this.currentIndex];
    this.ui.showQuestion(question);
    this.ui.updateTimer(this.timer.getRemainingSeconds());
    this.ui.updateScore(this.scoreSystem.getScorePercent());
    this.ui.updateMotivator(this.scoreSystem.getScorePercent());
  }

  private endGame(won: boolean): void {
    this.trackTimeSample();
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

    const delta = now - this.lastSampleTimestamp;
    if (delta > 0) {
      this.totalTrackedMs += delta;
      if (this.scoreSystem.getScorePercent() >= this.config.winThresholdPercent) {
        this.timeAboveThresholdMs += delta;
      }
    }

    this.lastSampleTimestamp = now;
  }

  private resetTimeTracking(): void {
    this.timeAboveThresholdMs = 0;
    this.totalTrackedMs = 0;
    this.lastSampleTimestamp = this.now();
  }
}

