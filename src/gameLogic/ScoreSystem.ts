import { GameConfig, Phase, GAME_CONFIG } from '../data/GameConfig';


export class ScoreSystem {
  private currentCorrectAnswerCount: number = 0;


  applyAnswer(isCorrect: boolean, phase: Phase): void {
    if(isCorrect && phase === 'TEST') this.currentCorrectAnswerCount++;
  }

  getScoreCount(): number {
    return this.currentCorrectAnswerCount;
  }

  getScorePercent(): number {
    return this.currentCorrectAnswerCount/GAME_CONFIG.totalQuestions;
  }

  reset(): void{
    this.currentCorrectAnswerCount = 0;
  }


}

