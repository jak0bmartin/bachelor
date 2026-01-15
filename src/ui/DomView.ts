import { Question } from '../data/Question';
import { GameMode } from '../data/GameConfig';
import { MotivatorTheme, MOTIVATOR_THEMES } from './MotivatorTheme';
import { GAME_CONFIG } from '../data/GameConfig';



export class DomView {
  private startSound = new Audio(`${import.meta.env.BASE_URL}assets/start.mp3`);
  private positiv1 = new Audio(`${import.meta.env.BASE_URL}assets/positiv1.mp3`);
  private positiv2 = new Audio(`${import.meta.env.BASE_URL}assets/positiv2.mp3`);
  private negativ1 = new Audio(`${import.meta.env.BASE_URL}assets/negativ1.mp3`);
  private negativ2 = new Audio(`${import.meta.env.BASE_URL}assets/negativ2.mp3`);
  private negativ3 = new Audio(`${import.meta.env.BASE_URL}assets/negativ3.mp3`);
  private won = new Audio(`${import.meta.env.BASE_URL}assets/won.mp3`);
  private lost = new Audio(`${import.meta.env.BASE_URL}assets/lost.mp3`);
  private restartSound = new Audio(`${import.meta.env.BASE_URL}assets/restart.mp3`);
  private closeLost = new Audio(`${import.meta.env.BASE_URL}assets/closeLost.mp3`);
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
  private explainEnterHintEl: HTMLElement;
  private explainTexts: Array<{ text: string; callback?: () => void }> = [];
  private currentExplainIndex: number = 0;
  private explainEnterHandler: ((e: KeyboardEvent) => void) | null = null;
  private rightPanelEl: HTMLElement;
  private pruefphaseIntroEl: HTMLElement;

  private marieImageEl: HTMLImageElement;
  private terminatorWrapperEl: HTMLElement;
  private bronzeMedalEl: HTMLElement;
  private silverMedalEl: HTMLElement;
  private goldMedalEl: HTMLElement;
  private marieInfoEl: HTMLParagraphElement;
  private leftPipeEl: HTMLImageElement;
  private rightPipeEl: HTMLImageElement;
  private pressPlateEl: HTMLImageElement;
  private terminatorEl: HTMLImageElement;
  private torsoEl: HTMLImageElement;
  private explosionVideoEl: HTMLVideoElement;
  private augenEl: HTMLImageElement;


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
    this.terminatorEl = getEl<HTMLImageElement>('kopf');
    this.torsoEl = getEl<HTMLImageElement>('torso');
    this.augenEl = getEl<HTMLImageElement>('augen');
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
    this.explainEnterHintEl = getEl<HTMLElement>('explain-enter-hint');
    this.rightPanelEl = getEl<HTMLElement>('right-panel');
    this.pruefphaseIntroEl = getEl<HTMLElement>('prüfphase-intro');
    this.marieInfoEl = getEl<HTMLParagraphElement>('marie-info');

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
    this.gameOverEl.textContent = '';
    this.gameOverEl.classList.add('hidden');
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
      { text: "Sie gibt dir die Chance teil ihres Teams zu werden." },
      {
        text: "Beantworte die Chemie-Fragen richtig, um ihr Vertrauen zu gewinnen.",
        callback: () => { this.leftPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Überzeugst du sie, bist du an Bord." },
      { text: "Marie braucht exzellente Chemiker in ihrem Team!" },
      { text: "Das Quiz ist in zwei Phasen unterteilt: Lernphase und Prüfphase." },
      { text: "In der Lernphase kannst du die Fragen kennenlernen." },
      { text: "In der Prüfphase fließt jede Antwort in die Bewertung ein." },
      { text: "Für jede Frage hast du 15 Sekunden Zeit." },
      {text: "Mache den Ton an, Marie hat etwas zu sagen!"},
      { text: "Viel Erfolg!" },
      {
        text: "",
        callback: () => {
          this.leftPanelEl.style.filter = "blur(10px)";
          this.rightPanelEl.style.filter = "blur(10px)";
          this.startButtonEl.classList.remove('hidden');
          this.marieInfoEl.classList.remove('hidden');
          this.explainEnterHintEl.classList.add('hidden');
        }
      }
    ];

    this.renderExplainTexts(texts);


  }

  renderExplainTexts(texts: Array<{ text: string; callback?: () => void }>): void {
    this.explainTexts = texts;
    this.currentExplainIndex = 0;

    // Entferne alten Event-Listener falls vorhanden
    if (this.explainEnterHandler) {
      document.removeEventListener('keydown', this.explainEnterHandler);
    }

    // Zeige ">> drücke Enter" Hinweis
    this.explainEnterHintEl.classList.remove('hidden');

    // Zeige ersten Text
    this.showNextExplainText();

    // Füge Event-Listener für Enter hinzu
    this.explainEnterHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.showNextExplainText();
      }
    };
    document.addEventListener('keydown', this.explainEnterHandler);
  }

  private showNextExplainText(): void {
    if (this.currentExplainIndex >= this.explainTexts.length) {
      // Alle Texte durchlaufen, Event-Listener entfernen
      if (this.explainEnterHandler) {
        document.removeEventListener('keydown', this.explainEnterHandler);
        this.explainEnterHandler = null;
      }
      // Verstecke ">> drücke Enter" Hinweis
      this.explainEnterHintEl.classList.add('hidden');
      return;
    }

    const item = this.explainTexts[this.currentExplainIndex];
    this.renderNewExplainText(item.text);
    if (item.callback) {
      item.callback();
    }
    this.currentExplainIndex++;
  }

  renderTrophyExplainShell(): void {
    this.explainShellEl.classList.remove('hidden');
    this.leftPanelEl.style.filter = "blur(10px)";
    this.rightPanelEl.style.filter = "blur(10px)";

    const TIMEOUT_DURATION_CHAR = 50;

    const texts: Array<{ text: string; callback?: () => void }> = [
      { text: "Du hast also das Zeug zum Meister-Chemiker?" },
      {
        text: "Sammle Auszeichnungen, indem du die Fragen richtig beantwortest.",
        callback: () => { this.rightPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Je mehr Fragen du richtig beantwortest, desto höher deine Auszeichnung." },
      {
        text: "Beantworte die Fragen richtig, um die Auszeichnungen zu erhalten.",
        callback: () => { this.leftPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Das Quiz ist in zwei Phasen unterteilt: Lernphase und Prüfphase." },
      { text: "In der Lernphase kannst du die Fragen kennenlernen." },
      { text: "In der Prüfphase fließt jede Antwort in die Bewertung ein." },
      { text: "Für jede Frage hast du 15 Sekunden Zeit." },
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
        text: "Dein Ziel ist aber natürlich der Nobelpreis!",
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
          this.explainEnterHintEl.classList.add('hidden');
        }
      }
    ];

    this.renderExplainTexts(texts);
  }

  renderTerminatorExplainShell(): void {
    this.explainShellEl.classList.remove('hidden');
    this.leftPanelEl.style.filter = "blur(10px)";
    this.rightPanelEl.style.filter = "blur(10px)";

    const TIMEOUT_DURATION_CHAR = 50;

    const texts: Array<{ text: string; callback?: () => void }> = [
      { text: "Die Menschheit ist in der Zukunft in einem bitteren Krieg zwischen" },
      { text: "Menschen und Maschinen verwickelt." },
      { text: "Der Terminator ist im Auftrag der Maschinen aus der Zukunft geschickt worden," },
      { text: "um die Mutter des zukunftigen menschlichen Anführers zu töten." },
      { text: "Und so dessen Geburt zu verhindern." },
      { text: "Es liegt an dir den Terminator zu besiegen!" },
      {
        text: "Du hast es bereits geschafft ihn in eine Schrottpresse zu locken.",
        callback: () => { this.rightPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Jetzt muss die Presse ihn nur noch zerquetschen..." },
      {
        text: "Um die Presse zu betätigen, musst du die richtige Antworten auf die Fragen kennen.",
        callback: () => { this.leftPanelEl.style.filter = "blur(0px)"; }
      },
      { text: "Das Quiz ist in zwei Phasen unterteilt: Lernphase und Prüfphase." },
      { text: "Falsche Antworten haben in der Lernphase keine Konsequenzen." },
      { text: "Du kannst du die Fragen erst einmal kennenlernen." },
      { text: "In der Prüfphase fließt jede Antwort in die Bewertung ein." },
      { text: "Für jede Frage hast du 15 Sekunden Zeit." },
      { text: "Mach ihn fertig!" },
      {
        text: "",
        callback: () => {
          this.leftPanelEl.style.filter = "blur(10px)";
          this.rightPanelEl.style.filter = "blur(10px)";
          this.startButtonEl.classList.remove('hidden');
          this.explainEnterHintEl.classList.add('hidden');
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
    this.marieInfoEl.classList.add('hidden');
    // Entferne Event-Listener wenn Explain-Shell beendet wird
    if (this.explainEnterHandler) {
      document.removeEventListener('keydown', this.explainEnterHandler);
      this.explainEnterHandler = null;
    }
  }

  renderScoreBlocks(totalQuestions: number) {
    for (let i = 0; i < totalQuestions; i++) {
      const scoreBlock = document.createElement('div');
      scoreBlock.className = 'score-block';
      this.scoreSectionEl.appendChild(scoreBlock);
    }
  }

  resetScoreBlocks(totalQuestions: number) {
    for (let index = 0; index < totalQuestions; index++) {
      const block = this.scoreSectionEl.children[index] as HTMLElement;
      block.style.backgroundColor = 'rgba(241, 245, 249, 0.5)';
      block.style.boxShadow = '';
    }
  }

  updateScoreBlocks(index: number, isCorrect: boolean, phase: string) {
    if (phase === 'TEST') {
      if (isCorrect) {
        const block = this.scoreSectionEl.children[index] as HTMLElement;
        block.style.backgroundColor = '#00d084';
        block.style.boxShadow = '0 0 16px rgba(0, 208, 132, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.4)';
      } else {
        const block = this.scoreSectionEl.children[index] as HTMLElement;
        block.style.backgroundColor = '#ff3333';
        block.style.boxShadow = '0 0 16px rgba(255, 51, 51, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.4)';
      }
    }
    else if (phase === 'LEARN') {
      (this.scoreSectionEl.children[index] as HTMLElement).style.backgroundColor = '#4b5563';
    }
  }

  renderQuestion(question: Question): void {
    this.gameOverEl.textContent = '';
    this.gameOverEl.classList.add('hidden');
    this.questionEl.textContent = question.text;
    this.answersEl.innerHTML = '';
    this.currentAnswerButtons = [];

    // Optionen in zufälliger Reihenfolge
    const shuffledOptions = [...question.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    shuffledOptions.forEach((opt) => {
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

  renderTestPhaseIntro(mode: GameMode): void {
    // Entferne die richtige Antwort-Markierung von den Buttons
    this.currentAnswerButtons.forEach((btn) => {
      btn.classList.remove('answer-button--correct');
      btn.disabled = true;
    });

    // Blur beide Panels
    this.leftPanelEl.style.filter = "blur(10px)";
    this.rightPanelEl.style.filter = "blur(10px)";

    // Zeige Prüfphase-Intro
    this.pruefphaseIntroEl.classList.remove('hidden');

    // Nach 3 Sekunden alles wieder normal
    setTimeout(() => {
      this.leftPanelEl.style.filter = "blur(0px)";
      this.rightPanelEl.style.filter = "blur(0px)";
      this.pruefphaseIntroEl.classList.add('hidden');
    }, 3000);

    if (mode == GameMode.MARIE) this.startSound.play();


  }

  renderMotivator(correctAnswersPercent: number, mode: GameMode, questionTotal?: number, questionIndex?: number, phase?: 'LEARN' | 'TEST'): void {

    if (mode == GameMode.MARIE) this.renderMarie(correctAnswersPercent, questionTotal, questionIndex, phase);
    else if (mode == GameMode.TERMINATOR) this.renderTerminator(correctAnswersPercent);
    else if (mode == GameMode.TROPHY) this.renderTrophy(correctAnswersPercent);
  }

  renderMotivatorEnd(won: boolean, mode: GameMode, scorePercent?: number): void {
    if (mode == GameMode.MARIE) this.renderMarieEnd(won, scorePercent);
    else if (mode == GameMode.TERMINATOR) this.renderTerminatorEnd(won);
    else if (mode == GameMode.TROPHY) this.renderTrophyEnd(won);
  }

  renderMarieEnd(won: boolean, scorePercent?: number): void {
    if (won) {
      this.renderMotivator(1, GameMode.MARIE);
      this.won.play();
    }
    else {
      this.renderMotivator(0, GameMode.MARIE);
      if (scorePercent !== undefined && scorePercent >= 0.7) {
        this.closeLost.play();
      } else {
        this.lost.play();
      }
      setTimeout(() => {
        this.restartSound.play();
      }, 2500);
    }
  }

  renderTerminatorEnd(won: boolean): void {
    if (won) this.renderMotivator(1, GameMode.TERMINATOR);
    else this.renderMotivator(0, GameMode.TERMINATOR);
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

  renderGameOver(won: boolean, mode: GameMode, phase: 'LEARN' | 'TEST', scorePercent?: number): void {

    this.leftPanelEl.style.filter = "blur(10px)";
    this.gameOverEl.classList.remove('hidden');
    if (mode == GameMode.MARIE) {
      this.gameOverEl.innerHTML = won ? 'Gewonnen! <br>Du bist nun Teil des Forschungsteams!' : 'Verloren! <br> Marie braucht exzellente Chemiker!';
    }
    else if (mode == GameMode.TERMINATOR) {
      this.gameOverEl.innerHTML = won ? 'Gewonnen! <br>Du hast den Terminator besiegt!' : 'Verloren! <br>Der Terminator hat dich besiegt!';
    }
    else if (mode == GameMode.TROPHY) {
      this.gameOverEl.innerHTML = won ? 'Fantastisch! <br>Du hast den Nobelpreis gewonnen!' : 'Verloren! <br>Für den Nobelpreis hat es leider<br>nicht gereicht..';
    }
    else this.gameOverEl.textContent = won ? 'Gewonnen!' : 'Verloren!';
    this.gameOverEl.classList.remove('game-won', 'game-lost');
    this.gameOverEl.classList.add(won ? 'game-won' : 'game-lost');
    this.renderMotivatorEnd(won, mode, scorePercent);
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
    this.leftPanelEl.style.filter = "blur(0px)";
    this.rightPanelEl.style.filter = "blur(0px)";
  }

  renderNewExplainText(text: string): void {

    this.explainTextEl.textContent = text;


  }

  private renderMarie(correctAnswersPercent: number, questionTotal: number = 0, questionIndex: number = 0, phase?: 'LEARN' | 'TEST'): void {
    if (this.gameStart) this.setTheme(GameMode.MARIE);

    if (phase === 'TEST') {
      if (questionIndex / questionTotal == 0.3 && correctAnswersPercent < 0.3) {
        console.log("negativ1");
        this.negativ1.play();
      }
      else if (questionIndex / questionTotal == 0.3 && correctAnswersPercent == 0.3) this.positiv1.play();

      if (questionIndex / questionTotal == 0.6 && correctAnswersPercent < 0.6) {
        // Wenn bei 60% der Fragen nur 2 falsch sind (4 von 6 richtig = 0.667), dann negative3
        // 4 richtig von 6 = 4/6 = 0.667, also correctAnswersPercent >= 0.667 bedeutet nur 2 falsch
        if (correctAnswersPercent >= 0.4) {
          this.negativ3.play();
        } else {
          this.negativ2.play();
        }
      }
      else if (questionIndex / questionTotal == 0.6 && correctAnswersPercent == 0.6) this.positiv2.play();
    }

    const marieTheme = this.motivatorThemes[GameMode.MARIE];
    let mood: string;
    if (correctAnswersPercent <= 0.3) {
      mood = 'sauer';
    } else if (correctAnswersPercent <= 0.6) {
      mood = 'enttauscht';

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
    let newPipeHeight = (correctAnswersPercent / 2.0) * maxPipeHeightPx;
    if (correctAnswersPercent == 1) newPipeHeight = correctAnswersPercent * maxPipeHeightPx;

    this.rightPipeEl.style.height = `${newPipeHeight}px`;
    this.leftPipeEl.style.height = `${newPipeHeight}px`;
    this.pressPlateEl.style.top = `${newPipeHeight + startOfPressPlatePx}px`;
    console.log(newPipeHeight);
    if (newPipeHeight < 35) { this.terminatorEl.style.transition = 'transform 0.6s ease'; this.terminatorEl.style.transform = 'scaleY(1)'; this.torsoEl.style.transform = 'scaleY(1)'; this.torsoEl.style.display = 'unset'; this.terminatorEl.style.display = 'unset';this.augenEl.style.opacity = '1.0'; this.augenEl.style.transform = 'scaleY(1)'; this.augenEl.style.top = '422px';}
    else if (newPipeHeight == 35) { this.terminatorEl.style.transform = 'scaleY(0.95)'; this.augenEl.style.opacity = '0.95'; this.augenEl.style.transform = 'scaleY(0.95)'; }
    else if (newPipeHeight == 50) { this.terminatorEl.style.transform = 'scaleY(0.97)'; this.augenEl.style.opacity = '0.90'; this.augenEl.style.transform = 'scaleY(0.97)'; this.augenEl.style.top = '430px'; }
    else if (newPipeHeight == 125 / 2) { this.terminatorEl.style.transform = 'scaleY(0.9)'; this.augenEl.style.opacity = '0.85'; this.augenEl.style.transform = 'scaleY(0.9)'; this.augenEl.style.top = '435px';}
    else if (newPipeHeight == 150 / 2) { this.terminatorEl.style.transform = 'scaleY(0.80) scaleX(1.2)'; this.augenEl.style.opacity = '0.80'; this.augenEl.style.transform = 'scaleY(0.80) scaleX(1.2)'; this.augenEl.style.top = '440px';}
    else if (newPipeHeight == 175 / 2) { this.terminatorEl.style.transform = 'scaleY(0.75) scaleX(1.3)'; this.augenEl.style.opacity = '0.75'; this.augenEl.style.transform = 'scaleY(0.75) scaleX(1.3)'; this.augenEl.style.top = '445px';}
    else if (newPipeHeight == 200 / 2) { this.terminatorEl.style.transform = 'scaleY(0.70) scaleX(1.35)'; this.augenEl.style.opacity = '0.70'; this.augenEl.style.transform = 'scaleY(0.70) scaleX(1.35)'; this.augenEl.style.top = '450px';}
    else if (newPipeHeight == 225 / 2) { this.terminatorEl.style.transform = 'scaleY(0.65) scaleX(1.4)'; this.augenEl.style.transform = 'scaleY(0.65) scaleX(1.4)'; this.augenEl.style.top = '455px';}
    else if (newPipeHeight == 250) {
      this.torsoEl.style.transform = 'scaleY(0.1)';
      setTimeout(() => {
        this.torsoEl.style.display = 'none';
        this.terminatorEl.style.display = 'none';
      }, 100);
      this.terminatorEl.style.transform = 'scaleY(0.1) scaleX(1.45)';
    }

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
        this.renderNewExplainText("Du erhälst den Doktortitel! Herzlichen Glückwunsch!");
        setTimeout(() => {
          this.renderNewExplainText("");
        }, 3000);
        this.motivatorThemes[GameMode.TROPHY].bronze = true;
      }
    } else {
      this.bronzeMedalEl.classList.remove('medal-earned');
    }

    if (correctAnswersPercent >= silverThreshold) {
      this.silverMedalEl.classList.add('medal-earned');
      if (this.motivatorThemes[GameMode.TROPHY].silver === false) {
        this.renderNewExplainText("Du erhälst die Davy-Medaille! Wow!");
        setTimeout(() => {
          this.renderNewExplainText("");
        }, 3000);
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
