// theme.ts (oder in DomView/domRenderer)
import { GameMode } from '../data/GameConfig';

export type MotivatorTheme = {
  label: string;
  introText?: string;
  images?: string[];
  marieImages?: Record<string, string>;
};

export const MOTIVATOR_THEMES: Record<GameMode, MotivatorTheme> = {
  [GameMode.TROPHY]: {
    label: 'Trophy',
    introText: 'Fülle die Trophäe…',
  },
  [GameMode.TERMINATOR]: {
    label: 'Terminator',
    introText: 'Halte den Terminator auf…',
    images: ['/assets/terminator.png'],
  },
  [GameMode.MARIE]: {
    label: 'Marie Curie',
    introText: 'Gewinne Maries Vertrauen…',
    marieImages: {sauer: './assets/sauer.gif', enttäuscht: './assets/enttäuscht.gif', neutral: './assets/neutral.gif', zufrieden: './assets/zufrieden.gif', strahlend: './assets/strahlend.gif'}, 
  },
};