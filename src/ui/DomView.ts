import { Question } from '../domain/Questions';
import { GameMode } from '../domain/GameConfig';
import { MotivatorTheme, MOTIVATOR_THEMES } from './MotivatorTheme';
import { GAME_CONFIG } from '../domain/GameConfig';

/**
 * Handles all DOM updates and user interaction bindings.
 * Acts as the View layer: receives state updates and applies them to the UI.
 */
export class DomView {
  private motivatorThemes: Record<GameMode, MotivatorTheme>;

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
  private skipLearnButtonEl: HTMLButtonElement;
  private leftPanelEl: HTMLElement;

  private marieImageEl: HTMLImageElement;
  private terminatorWrapperEl: HTMLElement;
  private trophyImageEl: HTMLImageElement;


  private terminatorPipeEl: HTMLElement;


  private performanceFillEl: HTMLElement;
  private gameModeSimpleButtonEl: HTMLButtonElement;
  private gameModeTerminatorButtonEl: HTMLButtonElement;
  private gameModeMarieButtonEl: HTMLButtonElement;
  private gameShellEl: HTMLElement;
  private menuShellEl: HTMLElement;
  private scoreSectionEl: HTMLElement;

  private currentAnswerButtons: HTMLButtonElement[] = [];
  private lastTimerSeconds: number | null = null;
  private currentMood: string | null = null;

  private gameStart = true;


  private performanceRecord = 400;
  private goUp = true;
  private isBlured = false;

  onAnswerSelected?: (optionId: number) => void;
  onSkipLearn?: () => void;
  onGameModeSelected?: (mode: GameMode) => void;

  constructor(doc: Document = document) {
    const questionElement = doc.getElementById('question-text');
    const answersElement = doc.getElementById('answers');
    const timerElement = doc.getElementById('timer') as HTMLSpanElement | null;
    const timerClockElement = doc.querySelector('.timer-clock') as HTMLElement | null;
    const phaseLabelElement = doc.getElementById('phase-label');
    const questionIndexElement = doc.getElementById('question-index-label');
    const scoreFillElement = doc.getElementById('score-fill');
    const performanceFillElement = doc.getElementById('performance-fill');
    const motivatorElement = doc.getElementById('motivator-text');
    const gameOverElement = doc.getElementById('game-over');
    const timeAboveElement = doc.getElementById('time-above-info');
    const skipLearnButton = doc.getElementById('skip-learn-button') as HTMLButtonElement | null;
    const gameModeSimpleButtonElement = doc.getElementById('game-mode-simple') as HTMLButtonElement | null;;
    const gameModeTerminatorButtonElement = doc.getElementById('game-mode-terminator') as HTMLButtonElement | null;;
    const gameModeMarieButtonElement = doc.getElementById('game-mode-marie') as HTMLButtonElement | null;
    const gameShellElement = doc.getElementById('game-shell');
    const menuShellElement = doc.getElementById('menu-shell');
    const leftPanelElement = doc.getElementById('left-panel');
    const scoreSectionElement = doc.getElementById('score-section');

    const terminatorWrapperElement = doc.getElementById('terminator-wrapper');
    const marieImageElement = doc.getElementById('mood-image') as HTMLImageElement | null;
    const trophyImageElement = doc.getElementById('trophy-image') as HTMLImageElement | null;

    const terminatorPipeElement = doc.getElementById('pipe');

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
      !marieImageElement ||
      !terminatorWrapperElement ||
      !performanceFillElement ||
      !gameModeSimpleButtonElement ||
      !gameModeTerminatorButtonElement ||
      !gameModeMarieButtonElement ||
      !gameShellElement ||
      !menuShellElement ||
      !trophyImageElement ||
      !terminatorPipeElement ||
      !leftPanelElement ||
      !scoreSectionElement
    ) {
      throw new Error('DomView: Missing one or more required DOM elements.');
    }


    this.motivatorThemes = MOTIVATOR_THEMES;

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
    this.skipLearnButtonEl = skipLearnButton;


    this.marieImageEl = marieImageElement;
    this.terminatorWrapperEl = terminatorWrapperElement;
    this.trophyImageEl = trophyImageElement;

    this.terminatorPipeEl = terminatorPipeElement;



    this.performanceFillEl = performanceFillElement;
    this.gameModeSimpleButtonEl = gameModeSimpleButtonElement;
    this.gameModeTerminatorButtonEl = gameModeTerminatorButtonElement;
    this.gameModeMarieButtonEl = gameModeMarieButtonElement;
    this.gameShellEl = gameShellElement;
    this.menuShellEl = menuShellElement;
    this.leftPanelEl = leftPanelElement;
    this.scoreSectionEl = scoreSectionElement;


    this.skipLearnButtonEl.onclick = () => this.onSkipLearn?.();
    this.gameModeSimpleButtonEl.onclick = () => this.onGameModeSelected?.(GameMode.TROPHY);
    this.gameModeTerminatorButtonEl.onclick = () => this.onGameModeSelected?.(GameMode.TERMINATOR);
    this.gameModeMarieButtonEl.onclick = () => this.onGameModeSelected?.(GameMode.MARIE);
  }

  setAnswerHandler(handler: (optionId: number) => void): void {
    this.onAnswerSelected = handler;
  }

  renderGameShell(mode: GameMode): void {
    this.gameShellEl.classList.remove('hidden');
    this.menuShellEl.classList.add('hidden');
    this.renderMotivator(GAME_CONFIG.initialPerformanceScore, mode);
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

  renderBlurEffect(): void {
    //if (this.isBlured) { this.leftPanelEl.style.filter = "blur(0px)"; this.isBlured = false; }
    if (this.isBlured) {
      this.isBlured = false;
      this.scoreSectionEl.style.filter = "blur(0px)";
      this.currentAnswerButtons.forEach((b) => {
        b.style.filter = "blur(0px)";
      });
    }
    else if(!this.isBlured){
      this.isBlured = true;
      this.scoreSectionEl.style.filter = "blur(4px)";
      this.currentAnswerButtons.forEach((b) => {
        b.style.filter = "blur(4px)";
      });
    }
    //else if (!this.isBlured) { this.leftPanelEl.style.filter = "blur(4px)"; this.isBlured = true; }
  }

  renderScore(percent: number): void {
    this.scoreFillEl.style.width = `${percent}%`;
    const isPositiveSide = percent > 50;
    this.scoreFillEl.classList.toggle('score-fill--positive', isPositiveSide);
    this.motivatorEl.textContent = `Score: ${percent.toFixed(0)}%`;
  }

  renderMotivator(percent: number, mode: GameMode): void {

    if (mode == GameMode.MARIE) this.renderMarie(percent);
    else if (mode == GameMode.TERMINATOR) this.renderTerminator(percent);
    else if (mode == GameMode.TROPHY) this.renderTrophy(percent);
  }

  setTheme(mode: GameMode): void {
    if (mode == GameMode.MARIE) {
      this.terminatorWrapperEl.classList.add('hidden');
      this.trophyImageEl.classList.add('hidden');
    }
    else if (mode == GameMode.TERMINATOR) {
      this.marieImageEl.classList.add('hidden');
      this.trophyImageEl.classList.add('hidden');
    }
    else if (mode == GameMode.TROPHY) {
      this.marieImageEl.classList.add('hidden');
      this.terminatorWrapperEl.classList.add('hidden');
    }
    this.gameStart = false;
  }

  renderGameOver(won: boolean, mode: GameMode): void {
    this.gameOverEl.textContent = won ? 'Gewonnen! 🎉' : 'Verloren 😢';
    if(won)  this.renderMotivator(100, mode);
    if(!won)this.renderMotivator(0, mode);
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
    this.skipLearnButtonEl.disabled = phase !== 'LEARN';
  }

  renderTimeAbove(secondsAbove: number, fraction: number): void {
    const percent = (fraction * 100).toFixed(0);
    this.timeAboveEl.textContent = `Zeit ≥ 50%: ${secondsAbove.toFixed(1)} s (${percent} %)`;
    const percentNumber = (fraction * 100);
    if (percentNumber < 49)
      this.performanceFillEl.style.height = `${2 * percentNumber}%`;
    switch (true) {
      case (percentNumber >= 50):
        this.performanceFillEl.style.background = `#22c55e`;
        break;
      case (percentNumber > 25):
        this.performanceFillEl.style.background = `#f87171`;
        break;
      case (percentNumber > 0):
        this.performanceFillEl.style.background = `#ef4444`;
        break;
    }
    //this.updateMoodImage(percentNumber);
  }

  private renderMarie(abovePercent: number): void {

    if (this.gameStart) this.setTheme(GameMode.MARIE);

    const marieTheme = this.motivatorThemes[GameMode.MARIE];
    let mood: string;
    if (abovePercent <= 15) {
      mood = 'sauer';
    } else if (abovePercent <= 40) {
      mood = 'enttäuscht';
    } else if (abovePercent <= 55) {
      mood = 'zufrieden';
    } else {
      mood = 'strahlend';
    }

    if (mood === this.currentMood) {
      return;
    }
    this.currentMood = mood;

    this.marieImageEl.src = marieTheme.marieImages?.[mood] ?? '';
    this.marieImageEl.alt = `Marie Curie (${mood})`;
  }

  private renderTerminator(abovePercent: number): void {
    if (this.gameStart) this.setTheme(GameMode.TERMINATOR);
    const newPipeHeight = abovePercent * 10;
    if (abovePercent > 7 && abovePercent < 40) {
      this.terminatorPipeEl.style.height = `${newPipeHeight}px`;
    }
    else if (abovePercent * 10 >= 400) {
      const maxHeight = 420;
      const minHeight = 400;
      if (this.performanceRecord == maxHeight) {
        this.goUp = false;
      }
      else if (this.performanceRecord == minHeight) {
        this.goUp = true;
      }
      if (this.goUp) {
        this.performanceRecord += 1;
      }
      if (!this.goUp) {
        this.performanceRecord -= 1;
      }
      const newPipeHeight = this.performanceRecord;
      this.terminatorPipeEl.style.height = `${newPipeHeight}px`;
    }
  }

  private renderTrophy(abovePercent: number): void {
    if (this.gameStart) this.setTheme(GameMode.TROPHY);
  }
}
