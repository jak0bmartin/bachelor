import { GameConfig, Phase, applyAnswerScore, isImmediateLoss, GAME_CONFIG } from '../data/GameConfig';

/**
 * Handles score progression based on the active phase and answer correctness.
 * Encapsulates score boundaries and the "immediate loss" rule defined in {@link GameConfig}.
 */
export class ScoreSystem {
  readonly maxScore: number;
  readonly minScore: number;
  private currentScore: number;
  private readonly now: () => number = () => Date.now();
  private lastCallTime = 0;

  constructor(private readonly config: GameConfig = GAME_CONFIG) {
    this.maxScore = config.maxScorePercent;
    this.minScore = config.minScorePercent;
    this.currentScore = config.initialScorePercent;
  }


  applyAnswer(isCorrect: boolean, phase: Phase): void {
    this.currentScore = applyAnswerScore(this.currentScore, phase, isCorrect, this.config);
  }
 


  applyTimeDecay(phase: Phase): void {
    if (phase !== 'TEST') {
      return;
    }
    if(this.lastCallTime === 0){ this.lastCallTime = this.now(); return;}
    const deltaSeconds = (this.now() - this.lastCallTime)/1000;
    this.lastCallTime = this.now();

    const decayPerSecond = this.config.phase2TimeDecayPerSecond ?? 0;
    if (decayPerSecond === 0 || deltaSeconds <= 0) {
      return;
    }
    const next = this.currentScore + decayPerSecond * deltaSeconds;
    this.currentScore = Math.max(this.minScore, Math.min(this.maxScore, next));
  }

  reset(): void{
    this.lastCallTime = this.now();
  }

  getScorePercent(): number {
    return this.currentScore;
  }

  isImmediateLoss(): boolean {
    return isImmediateLoss(this.currentScore, this.config);
  }
}

