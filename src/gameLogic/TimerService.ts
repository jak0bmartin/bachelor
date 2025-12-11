export class TimerService {
  private questionStartedAt = 0;

  constructor(
    private readonly secondsPerQuestion: number,
    private readonly now: () => number = () => Date.now(),
  ) {}

  startQuestionTimer(): void {
    this.questionStartedAt = this.now();
  }

  reStartQuesionTimer(): void{
    this.startQuestionTimer();
  }

  hasTimeLeft(): boolean {
    return this.getRemainingSeconds() > 0;
  }

  getRemainingSeconds(): number {
    if (!this.questionStartedAt) {
      return this.secondsPerQuestion;
    }
    const elapsedMs = this.now() - this.questionStartedAt;
    const remaining = this.secondsPerQuestion - Math.floor(elapsedMs / 1000);
    return Math.max(0, remaining);
  }

  getRemainingFraction(): number {
    if (!this.questionStartedAt) {
      return 1;
    }
    const elapsedMs = this.now() - this.questionStartedAt;
    const remainingMs = this.secondsPerQuestion * 1000 - elapsedMs;
    const percentValue = remainingMs / (this.secondsPerQuestion * 1000);
    return Math.max(0, Math.min(1, percentValue));
  }
}
