// GameConfig.ts

// Phasen des Spiels: Lernphase (keine Bewertung) und Testphase (Bewertung aktiv)
export type Phase = 'LEARN' | 'TEST';

// Ergebnis einer kompletten Spielsitzung, nützlich für Auswertung und Logging
export interface GameResult {
  won: boolean;
  finalScorePercent: number;              // Score am Ende in Prozent (0–100)
  minScorePercent: number;                // niedrigster Score während der Sitzung
  timeAboveThresholdFraction: number; 
}

export enum GameMode {
  TROPHY = 'Trophy',
  TERMINATOR = 'Terminator',
  MARIE = 'Marie',
}

// Zentrale Spielkonfiguration, direkt aus dem Scoring-Konzept abgeleitet
export interface GameConfig {
  MsPerQuestion: number;
  totalQuestions: number;
}

// Konkrete Standardkonfiguration deines Spiels
export const GAME_CONFIG: GameConfig = {
  MsPerQuestion: 10000,
  totalQuestions: 10,
};

export const getTotalTestDurationMs = (config: Pick<GameConfig, 'MsPerQuestion'|'totalQuestions'>) =>
  config.MsPerQuestion * config.totalQuestions;


