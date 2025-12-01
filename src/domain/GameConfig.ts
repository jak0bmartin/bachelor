// GameConfig.ts

// Phasen des Spiels: Lernphase (keine Bewertung) und Testphase (Bewertung aktiv)
export type Phase = 'LEARN' | 'TEST';

// Eine Antwortoption zu einer Frage
export interface AnswerOption {
  id: number;
  text: string;
}

// Eine Frage mit möglichen Antworten
export interface Question {
  id: number;
  text: string;
  options: AnswerOption[];
  correctOptionId: number;
}

// Ergebnis einer kompletten Spielsitzung, nützlich für Auswertung und Logging
export interface GameResult {
  won: boolean;
  finalScorePercent: number;              // Score am Ende in Prozent (0–100)
  minScorePercent: number;                // niedrigster Score während der Sitzung
  timeAboveThresholdFraction: number;     // Anteil der Zeit über winThresholdPercent (0–1)
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

  // Gewinn- / Verlustbedingungen
  lossThresholdPercent: number;           // z.B. 0: wenn Score == 0 -> sofort verloren
  winThresholdPercent: number;            // z.B. 50: „rechte Seite“ des Balkens
  requiredAboveThresholdFraction: number; // z.B. 0.5: mind. 50 % der Zeit über winThresholdPercent
}

// Konkrete Standardkonfiguration deines Spiels
export const GAME_CONFIG: GameConfig = {
  secondsPerQuestion: 10,
  totalQuestions: 8,

  maxScorePercent: 100,
  minScorePercent: 0,
  initialScorePercent: 50,

  scoreActiveInLearnPhase: false,
  phase2DeltaCorrect: +10,
  phase2DeltaWrong: -10,

  lossThresholdPercent: 0,
  winThresholdPercent: 50,
  requiredAboveThresholdFraction: 0.5,
};

// Beispielhafte Fragenliste (Platzhalter-Inhalte)
// Du kannst hier deine echten Fragen eintragen; jede Frage wird in Phase 1 und Phase 2 verwendet.
export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Welches chemische Element ist Natrium?',
    options: [
      { id: 1, text: 'Gasförmiges Nichtmetall' },
      { id: 2, text: 'Edelgas' },
      { id: 3, text: 'Metall' },
    ],
    correctOptionId: 3,
  },
  {
    id: 2,
    text: 'Welche Aussage über Edelgase trifft zu?',
    options: [
      { id: 1, text: 'Sie sind sehr reaktiv.' },
      { id: 2, text: 'Sie sind weitgehend reaktionsträge.' },
      { id: 3, text: 'Sie sind nur in festen Verbindungen stabil.' },
    ],
    correctOptionId: 2,
  },
  // TODO: weitere Fragen ergänzen (bis totalQuestions erreicht ist)
];

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
  return scorePercent <= config.lossThresholdPercent;
}
