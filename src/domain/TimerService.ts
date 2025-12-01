/**
 * Lightweight timer helper. Uses Date.now by default but can be injected for tests.
 */
export class TimerService {
  private questionStartedAt = 0;

  constructor(
    private readonly secondsPerQuestion: number,
    private readonly now: () => number = () => Date.now(),
  ) {}

  startQuestion(): void {
    this.questionStartedAt = this.now();
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
}

