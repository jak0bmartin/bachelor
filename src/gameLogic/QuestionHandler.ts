import { Question } from "../data/Question";

export class QuestionHandler {
    private readonly questions: Question[];
    private readonly questionTotalNumber: number;
    private currentQuestionIndex = 0;

    constructor(questions: Question[]){
        this.questions = questions;
        this.questionTotalNumber = questions.length;
    }
    getCorrectAnswer(): number{ 
        return this.questions[this.currentQuestionIndex].correctOptionId;
    }

    setQuestionsToTestPhase(): void{
        this.currentQuestionIndex = 0;
    }

    setNextQuestion(): void{
        this.currentQuestionIndex++;
    }

    getQuestion(): Question{
        const question = this.questions[this.currentQuestionIndex];
        return question;
    }

    getCurrentQuestionIndex(): number{
        return this.currentQuestionIndex;
    }

    getQuestionTotalNumber(): number{
        return this.questionTotalNumber;
    }

    isLastQuestion(): boolean{
       return this.getCurrentQuestionIndex() + 1 >= this.getQuestionTotalNumber();
    }
}