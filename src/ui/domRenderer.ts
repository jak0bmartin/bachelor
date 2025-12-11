import { Phase, GameMode} from '../domain/GameConfig';
import { Question } from '../domain/Questions';
import { DomView } from './DomView';

type UIEvents = {
  onAnswerSelected?: (optionId: number) => void;
  onSkipLearn?: () => void;
  onGameModeSelected?: (mode: GameMode) => void;
};

/**
 * Thin abstraction over DomView. Exposes UI operations to the controller
 * and forwards user events back via callbacks.
 */
export class UIRenderer {
  private readonly view: DomView;

  constructor(events: UIEvents = {}) {
    this.view = new DomView();
    this.view.setAnswerHandler((optionId) => events.onAnswerSelected?.(optionId));
    this.view.onSkipLearn = events.onSkipLearn;
    this.view.onGameModeSelected = events.onGameModeSelected;
  }

  showGameShell(mode: GameMode): void{
    this.view.renderGameShell(mode);
  }

  showQuestion(question: Question): void {
    this.view.renderQuestion(question);
  }

  showCorrectAnswerIndex(correctOptionId: number): void {
    this.view.renderCorrectAnswerIndex(correctOptionId);
  }

  updateQuestionIndex(current: number, total: number): void {
    this.view.renderQuestionIndex(current, total);
  }

  updatePhase(phase: Phase): void {
    this.view.renderPhase(phase);
  }

  updateTimer(seconds: number, fraction: number): void {
    this.view.renderTimer(seconds, fraction);
  }

  updateScore(percent: number): void {
    this.view.renderScore(percent);
  }

  updateMotivator(percent: number, mode: GameMode): void {
    this.view.renderMotivator(percent, mode);
  }

  updateTimeAbove(secondsAbove: number, fraction: number): void {
    this.view.renderTimeAbove(secondsAbove, fraction);
  }

  showGameOver(won: boolean, mode: GameMode): void {
    this.view.renderGameOver(won, mode);
  }

  setBlur(): void{
    this.view.renderBlurEffect();
  }
}
