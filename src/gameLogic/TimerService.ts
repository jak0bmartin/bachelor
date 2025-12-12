export class TimerService {
  private questionStartedAt = 0;

  constructor(
    private readonly MsPerQuestion: number,
    private readonly now: () => number = () => Date.now(),
  ) {}

  startQuestionTimer(): void {
    this.questionStartedAt = this.now();
  }

  reStartQuesionTimer(): void{
    this.startQuestionTimer();
  }

  hasTimeLeft(): boolean {
    return this.getRemainingMs() > 0;
  }

  getRemainingMs(): number {
    if (!this.questionStartedAt) {
      return this.MsPerQuestion;
    }
    const elapsedMs = this.now() - this.questionStartedAt;
    const remaining = this.MsPerQuestion - Math.floor(elapsedMs);
    return Math.max(0, remaining);
  }

  getRemainingFraction(): number {
    if (!this.questionStartedAt) {
      return 1;
    }
    const elapsedMs = this.now() - this.questionStartedAt;
    const remainingMs = this.MsPerQuestion - elapsedMs;
    const percentValue = remainingMs / (this.MsPerQuestion);
    return Math.max(0, Math.min(1, percentValue));
  }
}
