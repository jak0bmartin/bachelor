/**
 * Motivator renders thematic feedback for the current score state.
 * Each concrete motivator can map the numeric score to its own narrative.
 */
export abstract class Motivator {
  abstract render(scorePercent: number): void;
  abstract renderGameOver(won: boolean): void;
}

class ConsoleMotivator extends Motivator {
  constructor(private readonly persona: string, private readonly encouragement: string[]) {
    super();
  }

  render(scorePercent: number): void {
    const index = Math.min(this.encouragement.length - 1, Math.max(0, Math.floor(scorePercent / 25)));
    console.log(`[${this.persona}] ${this.encouragement[index]} (${scorePercent}%)`);
  }

  renderGameOver(won: boolean): void {
    const ending = won ? 'Mission accomplished!' : 'We will be back stronger.';
    console.log(`[${this.persona}] ${ending}`);
  }
}

export class TrophyMotivator extends ConsoleMotivator {
  constructor() {
    super('Trophy', [
      'Let us get that shine back!',
      'Halfway to the podium.',
      'This trophy is almost ours!',
      'Victory sparkle unlocked!',
    ]);
  }
}

export class TerminatorMotivator extends ConsoleMotivator {
  constructor() {
    super('Terminator', [
      'I need your dedication.',
      'Target acquired, keep firing.',
      'Crushing resistance levels.',
      'Hasta la vista, failure.',
    ]);
  }
}

export class MarieCurieMotivator extends ConsoleMotivator {
  constructor() {
    super('Marie Curie', [
      'Curiosity ignites progress.',
      'Experiments look promising.',
      'Discovery is within reach.',
      'A breakthrough is inevitable.',
    ]);
  }
}

