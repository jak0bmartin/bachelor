// GameConfig.ts

// Phasen des Spiels: Lernphase (keine Bewertung) und Testphase (Bewertung aktiv)
export type Phase = 'LEARN' | 'TEST';

// Ergebnis einer kompletten Spielsitzung, nützlich für Auswertung und Logging
export interface GameResult {
  won: boolean;
  finalScorePercent: number;              // Score am Ende in Prozent (0–100)
  minScorePercent: number;                // niedrigster Score während der Sitzung
  timeAboveThresholdFraction: number;     // Anteil der Zeit über winThresholdPercent (0–1)
}

export enum GameMode {
  TROPHY = 'Trophy',
  TERMINATOR = 'Terminator',
  MARIE = 'Marie',
}

// Zentrale Spielkonfiguration, direkt aus dem Scoring-Konzept abgeleitet
export interface GameConfig {
  // Ablauf
  secondsPerQuestion: number;
  totalQuestions: number;


  // Score-Skala (für den Balken)
  maxScorePercent: number;
  minScorePercent: number;
  initialScorePercent: number;

  // Scoring-Regeln
  scoreActiveInLearnPhase: boolean;       // laut Konzept: false
  phase2DeltaCorrect: number;             // Veränderung in Prozentpunkten bei korrekter Antwort
  phase2DeltaWrong: number;               // Veränderung in Prozentpunkten bei falscher Antwort
  phase2TimeDecayPerSecond?: number;      // kontinuierlicher Punkteverlust pro Sekunde in Phase 2 (optional)

  // Scorebedingungen
  loseScoreThresholdPercent: number;           // z.B. 0: wenn Score == 0 -> sofort verloren
  winScoreThresholdPercent: number;            // z.B. 50: „rechte Seite“ des Balkens
  requiredScoreAboveThresholdFraction: number; // z.B. 0.5: mind. 50 % der Zeit über winThresholdPercent

  // Sieg/Verlustbedingungen
  initialPerformanceScore: number;
  maxPerformanceScore: number;
  minPerformanceScore: number;
}

// Konkrete Standardkonfiguration deines Spiels
export const GAME_CONFIG: GameConfig = {
  secondsPerQuestion: 10,
  totalQuestions: 10,

  maxScorePercent: 100,
  minScorePercent: 0,
  initialScorePercent: 50,

  scoreActiveInLearnPhase: false,
  phase2DeltaCorrect: +10,
  phase2DeltaWrong: -10,
  phase2TimeDecayPerSecond: -1,

  loseScoreThresholdPercent: 0,
  winScoreThresholdPercent: 51,
  requiredScoreAboveThresholdFraction: 0.5,

  initialPerformanceScore: 0,
  maxPerformanceScore: 60,
  minPerformanceScore: 0,
};

export const getTotalTestDurationMs = (config: Pick<GameConfig, 'secondsPerQuestion'|'totalQuestions'>) =>
  config.secondsPerQuestion * config.totalQuestions * 1000;


// Hilfsfunktion: wendet die Score-Regel aus dem Konfigurationsdokument an
export function applyAnswerScore(
  currentScorePercent: number,
  phase: Phase,
  isCorrect: boolean,
  config: GameConfig = GAME_CONFIG,
): number {
  // In der Lernphase keine Scoreänderung
  if (phase === 'LEARN' && !config.scoreActiveInLearnPhase) {
    return currentScorePercent;
  }

  let delta = 0;
  if (phase === 'TEST') {
    delta = isCorrect ? config.phase2DeltaCorrect : config.phase2DeltaWrong;
  }

  const next = currentScorePercent + delta;

  // Score im Bereich [minScorePercent, maxScorePercent] halten
  return Math.max(config.minScorePercent, Math.min(config.maxScorePercent, next));
}

// Hilfsfunktion: prüft sofortige Verlustbedingung
export function isImmediateLoss(scorePercent: number, config: GameConfig = GAME_CONFIG): boolean {
  return scorePercent <= config.loseScoreThresholdPercent;
}
