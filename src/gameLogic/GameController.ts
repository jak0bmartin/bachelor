import { GAME_CONFIG } from '../data/GameConfig';
import { GameConfig, Phase, GameMode } from '../data/GameConfig';
import { Question, QUESTIONS } from '../data/Question';
import { ScoreSystem } from './ScoreSystem';
import { TimerService } from './TimerService';
import { DomView } from '../ui/DomView';

import { QuestionHandler } from './QuestionHandler';

export class GameController {
  private readonly config: GameConfig;
  private readonly scoreSystem: ScoreSystem;
  private readonly timer: TimerService;
  private readonly ui: DomView;
  private readonly questionHandler: QuestionHandler;

  

  private tickIntervalId: number | null = null;

  private currentPhase: Phase = 'LEARN';
  private mode: GameMode = GameMode.TROPHY;
  
  private blurTimeoutId: number | null = null;
  private readonly DELAY_TIME = 1500;
  private readonly FIRSTQU_DELAY_TIME = 0;
  private questionAnswered = false;

  constructor() {
    this.questionHandler = new QuestionHandler(QUESTIONS);
    this.ui = new DomView();
    this.ui.setAnswerHandler((optionId) => this.processAnswer(optionId));
    this.ui.onSkipLearn = () => this.skipLearningPhase();
    this.ui.onReplay = () => this.restartGame();
    this.ui.onGameModeSelected = (mode: GameMode) => {
      this.mode = mode;
      this.ui.renderGameShell(mode);
      //this.start();
      this.ui.renderExplainShell(mode);
    };
    this.ui.onStartButtonClicked = () => this.start();
    this.config = GAME_CONFIG;
    this.scoreSystem = new ScoreSystem();
    this.timer = new TimerService(this.config.MsPerQuestion);
  }

  private start(): void {
    this.ui.renderEndExplainShell();
    this.currentPhase = 'LEARN';
    this.timer.startQuestionTimer();
    this.getQuestion(this.FIRSTQU_DELAY_TIME);
    this.startGameLoop();
  }

  private restartGame(): void{
    this.scoreSystem.reset();
    this.timer.startQuestionTimer();
    this.getQuestion(this.FIRSTQU_DELAY_TIME);
    this.startGameLoop();
    this.questionHandler.resetQuestions();
    this.ui.resetScoreBlocks(this.config.totalQuestions);
    this.ui.resetMedals();
    this.questionAnswered = false;
    this.ui.hideReplayButton();
    this.ui.renderMotivator(this.scoreSystem.getScorePercent(), this.mode);
  }

  private stopGameloop(): void {
    if (this.tickIntervalId !== null) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }

  private skipLearningPhase(): void{
    this.stopGameloop();
    this.currentPhase = 'TEST';
    this.getQuestion(this.FIRSTQU_DELAY_TIME);
    this.questionHandler.setQuestionsToTestPhase();
  }


  private startGameLoop(): void {

    this.stopGameloop();

    this.tickIntervalId = window.setInterval(() => {
      this.checkIfGameOver();

      this.uiForEveryTick();

      if (!this.timer.hasTimeLeft()) {
        this.processAnswer(-1);
      }
    }, 50);
  }

  private uiForEveryTick(): void{
      this.ui.renderQuestionIndex(this.questionHandler.getCurrentQuestionIndex()+1, this.questionHandler.getQuestionTotalNumber());
      this.ui.renderPhase(this.currentPhase);
      this.ui.renderTimer(this.timer.getRemainingMs()/1000, this.timer.getRemainingFraction());
      //this.ui.renderTimeAbove(this.performanceTracker.getPerformanceScoreMs()/1000,this.performanceTracker.getPerformanceScore());
      //this.ui.renderMotivator(this.performanceTracker.getPerformanceScore(), this.mode);
  }

  private checkIfGameOver(): boolean{
    let isOver = false;

    if(this.questionAnswered && (this.questionHandler.isLastQuestion() && this.currentPhase == 'TEST')){
      console.log("ich werde durchlaufen");
      this.stopGameloop();
      this.endGame();
      isOver = true;
    }

    return isOver;
  }

  private getQuestion(delay: number) {
    this.ui.renderBlurEffect(this.currentPhase);
    setTimeout(() => {
      this.ui.renderBlurEffect(this.currentPhase);
      const question = this.questionHandler.getQuestion();
      this.ui.renderQuestion(question);
      this.timer.startQuestionTimer();
      //this.questionAnswered = false;
      this.startGameLoop();
    }, delay);
  }

  private processAnswer(optionId: number) {
    const isAnswerCorrect = this.questionHandler.getCorrectAnswer() == optionId;
    this.stopGameloop();

    this.questionAnswered = true;
    this.ui.renderCorrectAnswerIndex(this.questionHandler.getCorrectAnswer());
    this.ui.updateScoreBlocks(this.questionHandler.getCurrentQuestionIndex(), isAnswerCorrect, this.currentPhase);
    this.scoreSystem.applyAnswer(isAnswerCorrect, this.currentPhase);
    this.ui.renderScore(this.scoreSystem.getScorePercent());

    //this.performanceTracker.changePerformanceScore(this.scoreSystem.getScorePercent(), this.timer.getRemainingMs(), isAnswerCorrect);
    //this.ui.renderTimeAbove(this.performanceTracker.getPerformanceScoreMs()/1000,this.performanceTracker.getPerformanceScore());
    this.ui.renderMotivator(this.scoreSystem.getScorePercent(), this.mode, this.questionHandler.getQuestionTotalNumber(), this.questionHandler.getCurrentQuestionIndex()+1, this.currentPhase);

    if(this.questionHandler.isLastQuestion() && this.currentPhase === 'LEARN'){
      this.questionHandler.setQuestionsToTestPhase();
      this.currentPhase = 'TEST';
    }
    else if(this.questionHandler.isLastQuestion() && this.currentPhase === 'TEST'){
      this.stopGameloop();
      this.endGame();
      return;
    }
    else this.questionHandler.setNextQuestion();
    this.questionAnswered = false;
    if(this.checkIfGameOver()) return;
    this.getQuestion(this.DELAY_TIME);
  }

  private endGame(): void {
    let won = false;
    if(this.scoreSystem.getScorePercent() === 1) won = true;
    this.ui.renderGameOver(won, this.mode, this.currentPhase);
  }

}
