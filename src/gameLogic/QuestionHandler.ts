import { Question } from "../data/Question";

export class QuestionHandler {
    private readonly questions: Question[];
    private nextQuestionIndex = 0;

    constructor(questions: Question[]){
        this.questions = questions;
    }
    getCorrectAnswer(): number{ 
        return this.questions[this.nextQuestionIndex-1].correctOptionId;
    }

    getNextQuestion(): Question{
        const question = this.questions[this.nextQuestionIndex];
        this.nextQuestionIndex++;
        return question;
    }

    getCurrentQuestionIndex(): number{
        return this.nextQuestionIndex-1;
    }
}