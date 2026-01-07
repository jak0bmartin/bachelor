import { Question } from '../data/Question';
import { GameMode } from '../data/GameConfig';
import { MotivatorTheme, MOTIVATOR_THEMES } from './MotivatorTheme';
import { GAME_CONFIG } from '../data/GameConfig';



export class DomView {
  private positiv = new Audio(`${import.meta.env.BASE_URL}assets/positiver.mp3`);
  private motivatorThemes: Record<GameMode, MotivatorTheme>;

  private startButtonEl: HTMLButtonElement;

  private questionEl: HTMLElement;
  private answersEl: HTMLElement;
  private timeBarFillEl: HTMLElement;
  private timeBarEl: HTMLElement;
  private phaseLabelEl: HTMLElement;
  private questionIndexEl: HTMLElement;
  private gameOverEl: HTMLElement;
  private skipLearnButtonEl: HTMLButtonElement;
  private replayButtonEl: HTMLButtonElement;
  private menuButtonEl: HTMLButtonElement;
  private leftPanelEl: HTMLElement;
  private explainTextEl: HTMLParagraphElement;
  private explainShellEl: HTMLElement;
  private rightPanelEl: HTMLElement;

  private marieImageEl: HTMLImageElement;
  private terminatorWrapperEl: HTMLElement;
  private bronzeMedalEl: HTMLElement;
  private silverMedalEl: HTMLElement;
  private goldMedalEl: HTMLElement;

  private leftPipeEl: HTMLImageElement;
  private rightPipeEl: HTMLImageElement;
  private pressPlateEl: HTMLImageElement;
  private terminatorEl: HTMLImageElement;
  private explosionVideoEl: HTMLVideoElement;

  private gameModeSimpleButtonEl: HTMLButtonElement;
  private gameModeTerminatorButtonEl: HTMLButtonElement;
  private gameModeMarieButtonEl: HTMLButtonElement;
  private gameShellEl: HTMLElement;
  private menuShellEl: HTMLElement;
  private scoreSectionEl: HTMLElement;
  private gameHeaderEl: HTMLElement;
  private medalsContainerEl: HTMLElement;

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
  onStartButtonClicked?: () => void;
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
    this.menuButtonEl = getEl<HTMLButtonElement>('menu-button');
    this.startButtonEl = getEl<HTMLButtonElement>('start-button');

    this.gameModeSimpleButtonEl = getEl<HTMLButtonElement>('game-mode-simple');
    this.gameModeTerminatorButtonEl = getEl<HTMLButtonElement>('game-mode-terminator');
    this.gameModeMarieButtonEl = getEl<HTMLButtonElement>('game-mode-marie');

    this.gameShellEl = getEl('game-shell');
    this.menuShellEl = getEl('menu-shell');
    this.leftPanelEl = getEl('left-panel');
    this.scoreSectionEl = getEl('score-section');
    this.gameHeaderEl = getEl('game-header');
    this.medalsContainerEl = getEl('medals-container');

    this.marieImageEl = getEl<HTMLImageElement>('mood-image');
    this.terminatorWrapperEl = getEl('terminator-wrapper');
    this.bronzeMedalEl = getEl('bronze-medal');
    this.silverMedalEl = getEl('silver-medal');
    this.goldMedalEl = getEl('gold-medal');

    this.leftPipeEl = getEl<HTMLImageElement>('pipe-left');
    this.rightPipeEl = getEl<HTMLImageElement>('pipe-right');
    this.pressPlateEl = getEl<HTMLImageElement>('press-plate');
    this.terminatorEl = getEl<HTMLImageElement>('terminator');
    this.explosionVideoEl = getEl<HTMLVideoElement>('explosion-video');

    this.replayButtonEl.onclick = () => this.onReplay?.();
    this.menuButtonEl.onclick = () => {
      window.location.reload();
    };
    this.skipLearnButtonEl.onclick = () => this.onSkipLearn?.();
    this.gameModeSimpleButtonEl.onclick = () => this.onGameModeSelected?.(GameMode.TROPHY);
    this.gameModeTerminatorButtonEl.onclick = () => this.onGameModeSelected?.(GameMode.TERMINATOR);
    this.gameModeMarieButtonEl.onclick = () => this.onGameModeSelected?.(GameMode.MARIE);
    this.startButtonEl.onclick = () => this.onStartButtonClicked?.();

    this.replayButtonEl.classList.add('hidden');
    this.menuButtonEl.classList.add('hidden');
    this.explainTextEl = getEl<HTMLParagraphElement>('explain-text');
    this.explainShellEl = getEl<HTMLElement>('explain-shell');
    this.rightPanelEl = getEl<HTMLElement>('right-panel');
  }


  setAnswerHandler(handler: (optionId: number) => void): void {
    this.onAnswerSelected = handler;
  }

  renderGameShell(mode: GameMode): void {
    this.gameShellEl.classList.remove('hidden');
    this.menuShellEl.classList.add('hidden');
    this.renderMotivator(0, mode);
    this.renderScoreBlocks(GAME_CONFIG.totalQuestions);
    this.replayButtonEl.classList.add('hidden');
    this.menuButtonEl.classList.add('hidden');
    this.renderPlaceholderAnswers();
  }

  renderPlaceholderAnswers(): void {
    this.answersEl.innerHTML = '';
    this.currentAnswerButtons = [];

    const placeholderTexts = ['Antwort A', 'Antwort B', 'Antwort C'];

    placeholderTexts.forEach((text) => {
      const btn = document.createElement('button');
      btn.className = 'answer-button';
      btn.textContent = text;
      btn.disabled = true;
      this.answersEl.appendChild(btn);
      this.currentAnswerButtons.push(btn as HTMLButtonElement);
    });
  }

  renderExplainShell(mode: GameMode): void {
    if (mode == GameMode.TERMINATOR) this.renderTerminatorExplainShell();
    else if (mode == GameMode.MARIE) this.renderMarieExplainShell();
    else if (mode == GameMode.TROPHY) this.renderTrophyExplainShell();

  }

  renderMarieExplainShell(): void {
    this.explainShellEl.classList.remove('hidden');
    this.leftPanelEl.style.filter = "blur(10px)";
    this.rightPanelEl.style.filter = "blur(10px)";

    const TIMEOUT_DURATION_CHAR = 50;

    const texts: Array<{ text: string; callback?: () => void }> = [
      {
        text: "Marie Curie ist eine der berühmtesten Wissenschaftlerinnen der Geschichte.",
        callback: () => { this.rightPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Marie gibt dir die Chance teil ihres Teams zu werden." },
      {
        text: "Beantworte die Fragen richtig, um ihr Vertrauen zu gewinnen.",
        callback: () => { this.leftPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Beantwortest du alle Fragen richtig, bist du an Bord." },
      { text: "Beantwortest eine Fragen falsch, bist du abgewiesen." },
      { text: "Marie braucht exzellente Chemiker in ihrem Team!" },
      { text: "Das Quiz ist in zwei Phasen unterteilt: Lernphase und Prüfphase." },
      { text: "In der Lernphase kannst du die Fragen kennen lernen." },
      { text: "In der Prüfphase fließt jede Antwort in die Bewertung ein." },
      { text: "Viel Erfolg!" },
      {
        text: "",
        callback: () => {
          this.leftPanelEl.style.filter = "blur(10px)";
          this.rightPanelEl.style.filter = "blur(10px)";
          this.startButtonEl.classList.remove('hidden');
        }
      }
    ];

    this.renderExplainTexts(texts);


  }

  renderExplainTexts(texts: Array<{ text: string; callback?: () => void }>): void {
    const TIMEOUT_DURATION_CHAR = 50;
    let currentTime = 0;

    texts.forEach((item) => {
      const charCount = item.text.replace(/\s+/g, '').length;
      const duration = charCount * TIMEOUT_DURATION_CHAR;

      setTimeout(() => {
        this.renderNewExplainText(item.text);
        if (item.callback) {
          item.callback();
        }
      }, currentTime);

      currentTime += duration;
    });
  }

  renderTrophyExplainShell(): void {
    this.explainShellEl.classList.remove('hidden');
    this.leftPanelEl.style.filter = "blur(10px)";
    this.rightPanelEl.style.filter = "blur(10px)";
    this.renderNewExplainText("Hallo SpielerIn!");

    const TIMEOUT_DURATION_CHAR = 50;

    const texts: Array<{ text: string; callback?: () => void }> = [
      { text: "Willkommen zum Chemie-Quiz!" },
      {
        text: "Sammle Auszeichnungen, indem du die Fragen richtig beantwortest.",
        callback: () => { this.rightPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Je mehr Fragen du richtig beantwortest, desto höher deine Auszeichnung." },
      {
        text: "Beantworte die Fragen richtig, um die Auszeichnungen zu erhalten.",
        callback: () => { this.leftPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Es handelt sich um Chemie-Fragen." },
      { text: "Das Quiz ist in zwei Phasen unterteilt: Lernphase und Prüfphase." },
      { text: "In der Lernphase kannst du die Fragen kennen lernen." },
      { text: "In der Prüfphase fließt jede Antwort in die Bewertung ein." },
      {
        text: "Bist du gut genug, bekommst du deinen Doktortitel.",
        callback: () => { this.bronzeMedalEl.classList.add('medal-earned'); }
      },
      {
        text: "Vielleicht reicht es ja dann sogar für die Davy-Medaille.",
        callback: () => {
          this.bronzeMedalEl.classList.remove('medal-earned');
          this.silverMedalEl.classList.add('medal-earned');
        }
      },
      {
        text: "Dein Ziel ist aber natürliche der Nobelpreis.",
        callback: () => {
          this.silverMedalEl.classList.remove('medal-earned');
          this.goldMedalEl.classList.add('medal-earned');
        }
      },
      {
        text: "Dann schauen wir mal wie du dich schlägst!",
        callback: () => { this.goldMedalEl.classList.remove('medal-earned'); }
      },
      {
        text: "",
        callback: () => {
          this.leftPanelEl.style.filter = "blur(10px)";
          this.rightPanelEl.style.filter = "blur(10px)";
          this.startButtonEl.classList.remove('hidden');
        }
      }
    ];

    this.renderExplainTexts(texts);
  }

  renderTerminatorExplainShell(): void {
    this.explainShellEl.classList.remove('hidden');
    this.leftPanelEl.style.filter = "blur(10px)";
    this.rightPanelEl.style.filter = "blur(10px)";
    this.renderNewExplainText("Hallo Spieler!");

    const TIMEOUT_DURATION_CHAR = 50;

    const texts: Array<{ text: string; callback?: () => void }> = [
      { text: "Die Menschheit ist in der Zukunft in einem bitteren Krieg zwischen" },
      { text: "Menschen und Maschinen verwickelt." },
      { text: "Der Terminator ist im Auftrag der Maschinen aus der Zukunft geschickt worden," },
      { text: "um die Mutter des zukunftigen menschlichen Anführers zu töten." },
      { text: "Und so dessen Geburt zu verhindern." },
      { text: "Es liegt an dir den Terminator zu besiegen, SpielerIn!" },
      {
        text: "Du hast es bereits geschafft ihn in eine Schrottpresse zu locken.",
        callback: () => { this.rightPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Jetzt muss die Presse ihn nur noch zerquetschen..." },
      {
        text: "Um die Presse zu betätigen, musst du die richtige Antworten auf die Fragen kennen.",
        callback: () => { this.leftPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Es handelt sich um Chemie-Fragen." },
      { text: "Das Quiz ist in zwei Phasen unterteilt: Lernphase und Prüfphase." },
      { text: "Falsche Antworten haben in der Lernphase keine Konsequenzen." },
      { text: "Du kannst du die Fragen erst einmal kennenlernen." },
      { text: "In der Prüfphase fließt jede Antwort in die Bewertung ein." },
      { text: "Mach ihn fertig!" },
      {
        text: "",
        callback: () => {
          this.leftPanelEl.style.filter = "blur(10px)";
          this.rightPanelEl.style.filter = "blur(10px)";
          this.startButtonEl.classList.remove('hidden');
        }
      }
    ];

    this.renderExplainTexts(texts);
  }

  renderEndExplainShell(): void {
    this.leftPanelEl.style.filter = "blur(0px)";
    this.rightPanelEl.style.filter = "blur(0px)";
    this.renderNewExplainText("");
    this.explainShellEl.classList.add('hidden');
  }

  renderScoreBlocks(totalQuestions: number) {
    for (let i = 0; i < totalQuestions; i++) {
      const scoreBlock = document.createElement('div');
      scoreBlock.className = 'score-block';
      this.scoreSectionEl.appendChild(scoreBlock);
    }
  }

  resetScoreBlocks(totalQuestions: number) {
    for (let index = 0; index < totalQuestions; index++)
      (this.scoreSectionEl.children[index] as HTMLElement).style.backgroundColor = 'rgba(241, 245, 249, 0.5)'
  }

  updateScoreBlocks(index: number, isCorrect: boolean, phase: string) {
    if (phase === 'TEST') {
      if (isCorrect) (this.scoreSectionEl.children[index] as HTMLElement).style.backgroundColor = '#86efac';
      else (this.scoreSectionEl.children[index] as HTMLElement).style.backgroundColor = '#f87171';
    }
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

  renderBlurEffect(phase: 'LEARN' | 'TEST' = 'LEARN'): void {
    if (this.isBlured) {
      this.isBlured = false;
      this.gameHeaderEl.style.filter = "blur(0px)";
      this.currentAnswerButtons.forEach((b) => {
        b.style.filter = "blur(0px)";
      });
      this.scoreSectionEl.style.filter = "blur(0px)";
      this.replayButtonEl.style.filter = "blur(0px)";
      this.menuButtonEl.style.filter = "blur(0px)";
    }
    else if (!this.isBlured) {
      this.isBlured = true;
      this.gameHeaderEl.style.filter = "blur(10px)";
      this.currentAnswerButtons.forEach((b) => {
        b.style.filter = "blur(10px)";
      });
      if (phase === 'LEARN') {
        this.scoreSectionEl.style.filter = "blur(10px)";
        this.replayButtonEl.style.filter = "blur(10px)";
        this.menuButtonEl.style.filter = "blur(10px)";
      }
    }
  }

  renderScore(percent: number): void {

  }

  renderMotivator(correctAnswersPercent: number, mode: GameMode): void {

    if (mode == GameMode.MARIE) this.renderMarie(correctAnswersPercent);
    else if (mode == GameMode.TERMINATOR) this.renderTerminator(correctAnswersPercent);
    else if (mode == GameMode.TROPHY) this.renderTrophy(correctAnswersPercent);
  }

  renderMotivatorEnd(won: boolean, mode: GameMode): void {
    if (mode == GameMode.MARIE) this.renderMarieEnd(won);
    else if (mode == GameMode.TERMINATOR) this.renderTerminatorEnd(won);
    else if (mode == GameMode.TROPHY) this.renderTrophyEnd(won);
  }

  renderMarieEnd(won: boolean): void {
    if (won) this.marieImageEl.classList.add('mood-image--happy');
    else this.marieImageEl.classList.add('mood-image--sad');
  }

  renderTerminatorEnd(won: boolean): void {
    this.renderMotivator(0, GameMode.TERMINATOR);
  }

  renderTrophyEnd(won: boolean): void {
    
  }

  resetMedals(): void {
    this.motivatorThemes[GameMode.TROPHY].bronze = false;
    this.motivatorThemes[GameMode.TROPHY].silver = false;
    this.motivatorThemes[GameMode.TROPHY].gold = false;
  }

  setTheme(mode: GameMode): void {
    if (mode == GameMode.MARIE) {
      this.terminatorWrapperEl.classList.add('hidden');
      this.medalsContainerEl.classList.add('hidden');
    }
    else if (mode == GameMode.TERMINATOR) {
      this.marieImageEl.classList.add('hidden');
      this.medalsContainerEl.classList.add('hidden');
    }
    else if (mode == GameMode.TROPHY) {
      this.marieImageEl.classList.add('hidden');
      this.terminatorWrapperEl.classList.add('hidden');
      this.medalsContainerEl.classList.remove('hidden');
    }
    this.gameStart = false;
  }

  renderGameOver(won: boolean, mode: GameMode, phase: 'LEARN' | 'TEST'): void {
    this.gameOverEl.textContent = '';
    this.renderMotivatorEnd(won,mode);
    this.currentAnswerButtons.forEach((b) => {
      b.disabled = true;
    });
    if (phase === 'TEST') {
      this.replayButtonEl.classList.remove('hidden');
      this.menuButtonEl.classList.remove('hidden');
    }
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
    if (phase === 'TEST') (this.phaseLabelEl as HTMLElement).style.color = `red`;
    if (phase === 'LEARN') this.rightPanelEl.style.filter = "blur(10px)";
    else if (phase === 'TEST') this.rightPanelEl.style.filter = "blur(0px)";
  }

  hideReplayButton(): void {
    this.replayButtonEl.classList.add('hidden');
    this.menuButtonEl.classList.add('hidden');
  }

  renderNewExplainText(text: string): void {
    // Animation stoppen
    //this.explainTextEl.style.animation = 'none';

    // Text setzen (während Animation gestoppt ist)
    this.explainTextEl.textContent = text;

    // Width zurücksetzen und Animation neu starten
    /*setTimeout(() => {
      this.explainTextEl.style.width = '0';
      // Kurz warten, damit width-Reset wirksam wird
      setTimeout(() => {
        this.explainTextEl.style.animation = 'typewriter 3s steps(60, end) forwards';
      }, 10);
    }, 10);*/
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
    let newPipeHeight = (correctAnswersPercent) * maxPipeHeightPx;

    this.rightPipeEl.style.height = `${newPipeHeight}px`;
    this.leftPipeEl.style.height = `${newPipeHeight}px`;
    this.pressPlateEl.style.top = `${newPipeHeight + startOfPressPlatePx}px`;
    console.log(newPipeHeight);
    if (newPipeHeight < 75) this.terminatorEl.style.transform = 'scaleY(1)';
    else if (newPipeHeight == 75) this.terminatorEl.style.transform = 'scaleY(0.9)';
    else if (newPipeHeight == 100) this.terminatorEl.style.transform = 'scaleY(0.85)';
    else if (newPipeHeight == 125) this.terminatorEl.style.transform = 'scaleY(0.8)';
    else if (newPipeHeight == 150) this.terminatorEl.style.transform = 'scaleY(0.7) scaleX(1.2)';
    else if (newPipeHeight == 175) this.terminatorEl.style.transform = 'scaleY(0.6) scaleX(1.3)';
    else if (newPipeHeight == 200) this.terminatorEl.style.transform = 'scaleY(0.5) scaleX(1.35)';
    else if (newPipeHeight == 225) this.terminatorEl.style.transform = 'scaleY(0.2) scaleX(1.4)';
    else if (newPipeHeight == 250) this.terminatorEl.style.transform = 'scaleY(0.1) scaleX(1.45)';

    if (correctAnswersPercent == 1)
      setTimeout(() => {
        this.explosionVideoEl.play();
      }, 200);

  }

  private renderTrophy(correctAnswersPercent: number): void {
    if (this.gameStart) this.setTheme(GameMode.TROPHY);
    
    // Bronze bei 30%, Silber bei 60%, Gold bei 100%
    const bronzeThreshold = 0.3;
    const silverThreshold = 0.6;
    const goldThreshold = 1.0;

    if (correctAnswersPercent >= bronzeThreshold) {
      this.bronzeMedalEl.classList.add('medal-earned');
      if (this.motivatorThemes[GameMode.TROPHY].bronze === false) {
        console.log("Bronze");
        const texts: Array<{ text: string; callback?: () => void }> = [{ text: "Du erhälst den Doktortitel! Herzlichen Glückwunsch!" }, { text: "" }]
        this.renderExplainTexts(texts);
        this.motivatorThemes[GameMode.TROPHY].bronze = true;
      }
    } else {
      this.bronzeMedalEl.classList.remove('medal-earned');
    }

    if (correctAnswersPercent >= silverThreshold) {
      this.silverMedalEl.classList.add('medal-earned');
      if (this.motivatorThemes[GameMode.TROPHY].silver === false) {
        const texts: Array<{ text: string; callback?: () => void }> = [{ text: "Du erhälst die Davy-Medaille! Wow!" }, { text: "" }]
        this.renderExplainTexts(texts);
        this.motivatorThemes[GameMode.TROPHY].silver = true;
      }
    } else {
      this.silverMedalEl.classList.remove('medal-earned');
    }

    if (correctAnswersPercent >= goldThreshold) {
      this.goldMedalEl.classList.add('medal-earned');
    } else {
      this.goldMedalEl.classList.remove('medal-earned');
    }
  }



}
