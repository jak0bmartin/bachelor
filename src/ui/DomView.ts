import { Question } from '../data/Question';
import { GameMode } from '../data/GameConfig';
import { MotivatorTheme, MOTIVATOR_THEMES } from './MotivatorTheme';
import { GAME_CONFIG } from '../data/GameConfig';


type UIEvents = {
  onAnswerSelected?: (optionId: number) => void;
  onSkipLearn?: () => void;
  onReplay?: () => void;
  onGameModeSelected?: (mode: GameMode) => void;
};

export class DomView {
  private motivatorThemes: Record<GameMode, MotivatorTheme>;

  private questionEl: HTMLElement;
  private answersEl: HTMLElement;
  private timeBarFillEl: HTMLElement;
  private timeBarEl: HTMLElement;
  private phaseLabelEl: HTMLElement;
  private questionIndexEl: HTMLElement;
  private gameOverEl: HTMLElement;
  private skipLearnButtonEl: HTMLButtonElement;
  private replayButtonEl: HTMLButtonElement;
  private leftPanelEl: HTMLElement;

  private marieImageEl: HTMLImageElement;
  private terminatorWrapperEl: HTMLElement;
  private trophyImageEl: HTMLImageElement;

  private leftPipeEl: HTMLImageElement;
  private rightPipeEl: HTMLImageElement;
  private pressPlateEl: HTMLImageElement;

  private gameModeSimpleButtonEl: HTMLButtonElement;
  private gameModeTerminatorButtonEl: HTMLButtonElement;
  private gameModeMarieButtonEl: HTMLButtonElement;
  private gameShellEl: HTMLElement;
  private menuShellEl: HTMLElement;
  private scoreSectionEl: HTMLElement;
  private gameHeaderEl: HTMLElement;

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
  onReplay?: () => void;

  constructor(doc: Document = document) {
    const getEl = <T extends HTMLElement>(id: string): T => {
      const el = doc.getElementById(id);
      if (!el) {
        throw new Error(`DomView: Missing DOM element #${id}`);
      }
      return el as T;
    };

    this.motivatorThemes = MOTIVATOR_THEMES;

    this.questionEl = getEl('question-text');
    this.answersEl = getEl('answers');
    this.timeBarFillEl = getEl('time-bar-fill');
    this.timeBarEl = getEl('time-bar');
    this.phaseLabelEl = getEl('phase-label');
    this.questionIndexEl = getEl('question-index-label');
    this.gameOverEl = getEl('game-over');
    this.skipLearnButtonEl = getEl<HTMLButtonElement>('skip-learn-button');
    this.replayButtonEl = getEl<HTMLButtonElement>('replay-button');

    this.gameModeSimpleButtonEl = getEl<HTMLButtonElement>('game-mode-simple');
    this.gameModeTerminatorButtonEl = getEl<HTMLButtonElement>('game-mode-terminator');
    this.gameModeMarieButtonEl = getEl<HTMLButtonElement>('game-mode-marie');

    this.gameShellEl = getEl('game-shell');
    this.menuShellEl = getEl('menu-shell');
    this.leftPanelEl = getEl('left-panel');
    this.scoreSectionEl = getEl('score-section');
    this.gameHeaderEl = getEl('game-header');

    this.marieImageEl = getEl<HTMLImageElement>('mood-image');
    this.terminatorWrapperEl = getEl('terminator-wrapper');
    this.trophyImageEl = getEl<HTMLImageElement>('trophy-image');

    this.leftPipeEl = getEl<HTMLImageElement>('pipe-left');
    this.rightPipeEl = getEl<HTMLImageElement>('pipe-right');
    this.pressPlateEl = getEl<HTMLImageElement>('press-plate');

    this.replayButtonEl.onclick = () => this.onReplay?.();
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
    this.renderMotivator(0,mode);
    this.renderScoreBlocks(GAME_CONFIG.totalQuestions);
  }

  renderScoreBlocks(totalQuestions: number){
    for(let i = 0; i < totalQuestions; i++){
      const scoreBlock = document.createElement('div');
      scoreBlock.className = 'score-block';
      this.scoreSectionEl.appendChild(scoreBlock);
    }
  }

  resetScoreBlocks(totalQuestions: number){
    for(let index = 0; index < totalQuestions; index++)
    (this.scoreSectionEl.children[index] as HTMLElement).style.backgroundColor = '#e9e9ed'
  }

  updateScoreBlocks(index: number, isCorrect: boolean, phase: string){
    if(phase === 'TEST'){
    if(isCorrect)(this.scoreSectionEl.children[index] as HTMLElement).style.backgroundColor = '#4CAF50';
    else (this.scoreSectionEl.children[index] as HTMLElement).style.backgroundColor = '#E53935';}
    else return;

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
    const progress = Math.max(0, Math.min(1, fraction));
    this.timeBarFillEl.style.width = `${progress * 100}%`;
 
    
  }

  renderBlurEffect(): void {
    //if (this.isBlured) { this.leftPanelEl.style.filter = "blur(0px)"; this.isBlured = false; }
    if (this.isBlured) {
      this.isBlured = false;
      //this.scoreSectionEl.style.filter = "blur(0px)";
      this.gameHeaderEl.style.filter = "blur(0px)";
      this.currentAnswerButtons.forEach((b) => {
        b.style.filter = "blur(0px)";
      });
    }
    else if (!this.isBlured) {
      this.isBlured = true;
      //this.scoreSectionEl.style.filter = "blur(10px)";
      this.gameHeaderEl.style.filter = "blur(10px)";
      this.currentAnswerButtons.forEach((b) => {
        b.style.filter = "blur(10px)";
      });
    }
    //else if (!this.isBlured) { this.leftPanelEl.style.filter = "blur(4px)"; this.isBlured = true; }
  }

  renderScore(percent: number): void {

  }

  renderMotivator(correctAnswersPercent: number, mode: GameMode): void {

    if (mode == GameMode.MARIE) this.renderMarie(correctAnswersPercent);
    else if (mode == GameMode.TERMINATOR) this.renderTerminator(correctAnswersPercent);
    else if (mode == GameMode.TROPHY) this.renderTrophy(correctAnswersPercent);
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
    if (won) this.renderMotivator(1, mode);
    if (!won) this.renderMotivator(0, mode);
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
    this.phaseLabelEl.textContent = phase === 'LEARN' ? 'Lernphase' : 'Prüfphase';
    this.skipLearnButtonEl.disabled = phase !== 'LEARN';
    if(phase === 'TEST') (this.phaseLabelEl as HTMLElement).style.color = `red`;
  }
  /*renderTimeAbove(secondsAbove: number, fraction: number): void {
    const percent = (fraction).toFixed(0);
    this.timeAboveEl.textContent = `Zeit ≥ 50%: ${secondsAbove.toFixed(1)} s (${percent} %)`;
    const percentNumber = (fraction);
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
    
  }*/

  private renderMarie(correctAnswersPercent: number): void {

    if (this.gameStart) this.setTheme(GameMode.MARIE);

    const marieTheme = this.motivatorThemes[GameMode.MARIE];
    let mood: string;
    if (correctAnswersPercent <= 0.3) {
      mood = 'sauer';
    } else if (correctAnswersPercent <= 0.6) {
      mood = 'enttäuscht';
    } else if (correctAnswersPercent <= 0.90) {
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

  private renderTerminator(correctAnswersPercent: number): void {
    if (this.gameStart) this.setTheme(GameMode.TERMINATOR);
    const maxPipeHeightPx = 250;
    const startOfPressPlatePx = 240;
    let newPipeHeight = (correctAnswersPercent)*maxPipeHeightPx;
    if(newPipeHeight < 15) newPipeHeight = 15;
    this.rightPipeEl.style.height =  `${newPipeHeight}px`;
    this.leftPipeEl.style.height =  `${newPipeHeight}px`;
    this.pressPlateEl.style.top = `${newPipeHeight+startOfPressPlatePx}px`;
  }

  private renderTrophy(abovePercent: number): void {
    if (this.gameStart) this.setTheme(GameMode.TROPHY);
    
  }

}
