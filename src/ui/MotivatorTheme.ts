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
    images: [`${import.meta.env.BASE_URL}assets/terminator.png`],
  },
  [GameMode.MARIE]: {
    label: 'Marie Curie',
    introText: 'Gewinne Maries Vertrauen…',
    marieImages: {
      sauer: `${import.meta.env.BASE_URL}assets/sauer.gif`,
      enttäuscht: `${import.meta.env.BASE_URL}assets/enttäuscht.gif`,
      neutral: `${import.meta.env.BASE_URL}assets/neutral.gif`,
      zufrieden: `${import.meta.env.BASE_URL}assets/zufrieden.gif`,
      strahlend: `${import.meta.env.BASE_URL}assets/strahlend.gif`
    }, 
  },
};
