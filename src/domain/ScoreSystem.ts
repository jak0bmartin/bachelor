import { GameConfig, Phase, applyAnswerScore, isImmediateLoss, GAME_CONFIG } from './GameConfig';

/**
 * Handles score progression based on the active phase and answer correctness.
 * Encapsulates score boundaries and the "immediate loss" rule defined in {@link GameConfig}.
 */
export class ScoreSystem {
  readonly maxScore: number;
  readonly minScore: number;
  private currentScore: number;

  constructor(private readonly config: GameConfig = GAME_CONFIG) {
    this.maxScore = config.maxScorePercent;
    this.minScore = config.minScorePercent;
    this.currentScore = config.initialScorePercent;
  }

  /**
   * Applies the scoring delta for the given answer and phase.
   */
  applyAnswer(isCorrect: boolean, phase: Phase): void {
    this.currentScore = applyAnswerScore(this.currentScore, phase, isCorrect, this.config);
  }

  getScorePercent(): number {
    return this.currentScore;
  }

  isImmediateLoss(): boolean {
    return isImmediateLoss(this.currentScore, this.config);
  }
}

