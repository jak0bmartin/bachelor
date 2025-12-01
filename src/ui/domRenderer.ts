import { Question } from '../domain/GameConfig';

type Hooks = {
  onShowQuestion?: (question: Question) => void;
  onUpdateTimer?: (seconds: number) => void;
  onUpdateScore?: (percent: number) => void;
  onUpdateMotivator?: (percent: number) => void;
  onShowGameOver?: (won: boolean) => void;
};

/**
 * Thin abstraction that forwards UI events to provided callbacks.
 * Keeps GameSession decoupled from the concrete rendering layer (DOM, React, etc.).
 */
export class UIRenderer {
  constructor(private readonly hooks: Hooks = {}) {}

  showQuestion(question: Question): void {
    this.hooks.onShowQuestion?.(question);
  }

  updateTimer(seconds: number): void {
    this.hooks.onUpdateTimer?.(seconds);
  }

  updateScore(percent: number): void {
    this.hooks.onUpdateScore?.(percent);
  }

  updateMotivator(percent: number): void {
    this.hooks.onUpdateMotivator?.(percent);
  }

  showGameOver(won: boolean): void {
    this.hooks.onShowGameOver?.(won);
  }
}

