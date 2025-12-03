import { Phase} from '../domain/GameConfig';
import { Question } from '../domain/Questions';
import { DomView } from './DomView';

type UIEvents = {
  onAnswerSelected?: (optionId: number) => void;
  onSkipLearn?: () => void;
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

  updateMotivator(percent: number): void {
    this.view.renderMotivator(percent);
  }

  updateTimeAbove(secondsAbove: number, fraction: number): void {
    this.view.renderTimeAbove(secondsAbove, fraction);
  }

  showGameOver(won: boolean): void {
    this.view.renderGameOver(won);
  }
}
