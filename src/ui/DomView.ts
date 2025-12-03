import { Question } from '../domain/Questions';

/**
 * Handles all DOM updates and user interaction bindings.
 * Acts as the View layer: receives state updates and applies them to the UI.
 */
export class DomView {
  private questionEl: HTMLElement;
  private answersEl: HTMLElement;
  private timerEl: HTMLSpanElement;
  private timerClockEl: HTMLElement;
  private phaseLabelEl: HTMLElement;
  private questionIndexEl: HTMLElement;
  private scoreFillEl: HTMLElement;
  private motivatorEl: HTMLElement;
  private gameOverEl: HTMLElement;
  private timeAboveEl: HTMLElement;
  private skipLearnButton: HTMLButtonElement;
  private moodImageEl: HTMLImageElement;

  private currentAnswerButtons: HTMLButtonElement[] = [];
  private lastTimerSeconds: number | null = null;
  private currentMood: string | null = null;

  onAnswerSelected?: (optionId: number) => void;
  onSkipLearn?: () => void;

  constructor(doc: Document = document) {
    const questionElement = doc.getElementById('question-text');
    const answersElement = doc.getElementById('answers');
    const timerElement = doc.getElementById('timer') as HTMLSpanElement | null;
    const timerClockElement = doc.querySelector('.timer-clock') as HTMLElement | null;
    const phaseLabelElement = doc.getElementById('phase-label');
    const questionIndexElement = doc.getElementById('question-index-label');
    const scoreFillElement = doc.getElementById('score-fill');
    const motivatorElement = doc.getElementById('motivator-text');
    const gameOverElement = doc.getElementById('game-over');
    const timeAboveElement = doc.getElementById('time-above-info');
    const skipLearnButton = doc.getElementById('skip-learn-button') as HTMLButtonElement | null;
    const moodImageElement = doc.getElementById('mood-image') as HTMLImageElement | null;

    if (
      !questionElement ||
      !answersElement ||
      !timerElement ||
      !timerClockElement ||
      !scoreFillElement ||
      !motivatorElement ||
      !gameOverElement ||
      !phaseLabelElement ||
      !questionIndexElement ||
      !timeAboveElement ||
      !skipLearnButton ||
      !moodImageElement
    ) {
      throw new Error('DomView: Missing one or more required DOM elements.');
    }

    this.questionEl = questionElement;
    this.answersEl = answersElement;
    this.timerEl = timerElement;
    this.timerClockEl = timerClockElement;
    this.phaseLabelEl = phaseLabelElement;
    this.questionIndexEl = questionIndexElement;
    this.scoreFillEl = scoreFillElement;
    this.motivatorEl = motivatorElement;
    this.gameOverEl = gameOverElement;
    this.timeAboveEl = timeAboveElement;
    this.skipLearnButton = skipLearnButton;
    this.moodImageEl = moodImageElement;

    this.skipLearnButton.onclick = () => this.onSkipLearn?.();
  }

  setAnswerHandler(handler: (optionId: number) => void): void {
    this.onAnswerSelected = handler;
  }

  renderQuestion(question: Question): void {
    this.gameOverEl.textContent = '';
    this.questionEl.textContent = question.text;
    this.answersEl.innerHTML = '';
    this.currentAnswerButtons = [];

    question.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'answer-button';
      btn.textContent = opt.text;
      (btn as HTMLButtonElement).dataset.optionId = String(opt.id);
      btn.onclick = () => this.onAnswerSelected?.(opt.id);
      this.answersEl.appendChild(btn);
      this.currentAnswerButtons.push(btn as HTMLButtonElement);
    });
  }

  renderTimer(seconds: number, fraction: number): void {
    this.timerEl.textContent = `${seconds.toString()}s`;
    const progress = Math.max(0, Math.min(1, fraction));
    this.timerClockEl.style.setProperty('--progress', progress.toString());
    const isDanger = seconds <= 3;
    this.timerClockEl.classList.toggle('timer-clock--danger', isDanger);
    this.timerEl.classList.toggle('timer-text--danger', isDanger);

    if (this.lastTimerSeconds === null || this.lastTimerSeconds !== seconds) {
      this.timerEl.classList.remove('timer-text--pulse');
      void this.timerEl.offsetWidth; // restart animation
      this.timerEl.classList.add('timer-text--pulse');
      this.lastTimerSeconds = seconds;
    }
  }

  renderScore(percent: number): void {
    this.scoreFillEl.style.width = `${percent}%`;
    const isPositiveSide = percent > 50;
    this.scoreFillEl.classList.toggle('score-fill--positive', isPositiveSide);
  }

  renderMotivator(percent: number): void {
    this.motivatorEl.textContent = `Score: ${percent.toFixed(0)}%`;
  }

  renderGameOver(won: boolean): void {
    this.gameOverEl.textContent = won ? 'Gewonnen! 🎉' : 'Verloren 😢';
    this.currentAnswerButtons.forEach((b) => {
      b.disabled = true;
    });
  }

  renderCorrectAnswerIndex(correctId: number): void {
    this.currentAnswerButtons.forEach((btn) => {
      const optionId = Number((btn as HTMLButtonElement).dataset.optionId);
      (btn as HTMLButtonElement).disabled = true;
      if (optionId === correctId) {
        btn.classList.add('answer-button--correct');
      }
    });
  }

  renderQuestionIndex(current: number, total: number): void {
    this.questionIndexEl.textContent = `Frage: ${current}/${total}`;
  }

  renderPhase(phase: 'LEARN' | 'TEST'): void {
    this.phaseLabelEl.textContent = phase === 'LEARN' ? 'Phase: Lernphase' : 'Phase: Prüfphase';
    this.skipLearnButton.disabled = phase !== 'LEARN';
  }

  renderTimeAbove(secondsAbove: number, fraction: number): void {
    const percent = (fraction * 100).toFixed(0);
    this.timeAboveEl.textContent = `Zeit ≥ 50%: ${secondsAbove.toFixed(1)} s (${percent} %)`;
    const percentNumber = (fraction * 100);
    this.updateMoodImage(percentNumber);
  }

  private updateMoodImage(abovePercent: number): void {
    let mood: string;
    if (abovePercent <= 30) {
      mood = 'sauer';
    } else if (abovePercent <= 45) {
      mood = 'enttauscht';
    } else if (abovePercent <= 55) {
      mood = 'neutral';
    } else if (abovePercent <= 75) {
      mood = 'zufrieden';
    } else {
      mood = 'strahlend';
    }

    if (mood === this.currentMood) {
      return;
    }
    this.currentMood = mood;
    const fileMap: Record<string, string> = {
      sauer: '/assets/sauer.gif',
      enttauscht: '/assets/enttäuscht.png',
      neutral: '/assets/neutral.jpg',
      zufrieden: '/assets/zufrieden.png',
      strahlend: '/assets/strahlend.png',
    };
    this.moodImageEl.src = fileMap[mood] ?? '';
    this.moodImageEl.alt = `Marie Curie (${mood})`;
  }
}
