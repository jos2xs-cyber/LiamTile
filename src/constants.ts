
import { Beer, Bike, Bird, Bone, Cake, Car, Cat, Cherry, Clapperboard, Cloud, Coffee, Cookie, Dog, Fish, Flower, Ghost, Gift, Heart, IceCream, Moon, Music, Palette, Pizza, Rabbit, Rocket, Smile, Star, Sun, Telescope, Tent, Train, Truck, Umbrella } from 'lucide-react';
import React from 'react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface DifficultySettings {
  gridSize: number;
  label: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultySettings> = {
  Easy: { gridSize: 4, label: 'Easy (4x4)' },
  Medium: { gridSize: 6, label: 'Medium (6x6)' },
  Hard: { gridSize: 8, label: 'Hard (8x8)' },
};

export type Theme = 'Animals' | 'Yummy' | 'Things' | 'Playtime';

export interface TileTheme {
  name: Theme;
  icons: string[];
  color: string;
  bg: string;
}

export const THEMES: TileTheme[] = [
  {
    name: 'Animals',
    icons: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    color: 'bg-orange-400',
    bg: 'bg-orange-50',
  },
  {
    name: 'Yummy',
    icons: ['🍦', '🍩', '🍪', '🍰', '🧁', '🥧', '🍫', '🍬'],
    color: 'bg-pink-400',
    bg: 'bg-pink-50',
  },
  {
    name: 'Things',
    icons: ['🚀', '🚁', '🚂', '🚁', '🚜', '🚲', '🛸', '⛵'],
    color: 'bg-blue-400',
    bg: 'bg-blue-50',
  },
  {
    name: 'Playtime',
    icons: ['🎨', '🎮', '🧩', '🧸', '🪁', '🎸', '⚽', '🏀'],
    color: 'bg-yellow-400',
    bg: 'bg-yellow-50',
  },
];

// Expanded icon sets for higher difficulties
export const ALL_ICONS: Record<Theme, string[]> = {
  Animals: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞',
    '🐜', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🐙', '🦑', '🦐', '🦀', '🐡', '🐠', '🐬', '🐳'
  ],
  Yummy: [
    '🍦', '🍩', '🍪', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍓', '🍒', '🍑', '🍐', '🍎',
    '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🫐', '🍈', '🍍', '🥭', '🍅', '🍆', '🌽', '🌶️', '🍕', '🍟',
    '🍔', '🌭', '🥪', '🌮', '🌯', '🍳', '🥞', '🧇', '🥓', '🍖', '🍗', '🥨', '🥯', '🍣', '🍱', '🍧'
  ],
  Things: [
    '🚀', '🚁', '🚂', '🏎️', '🚜', '🚲', '🛸', '⛵', '🏠', '🗼', '🗽', '🎡', '🎢', '🌵', '🌋', '⛺',
    '📱', '💻', '⌚', '📷', '📺', '🎸', '🎹', '🎺', '🎻', '🎮', '🧩', '🎈', '🎁', '🎨', '🖌️', '🎬',
    '👟', '🕶️', '👑', '🎒', '🔋', '💡', '🔭', '🔬', '🌍', '🌋', '🌈', '🔥', '💧', '☁️', '⚡', '⛄'
  ],
  Playtime: [
    '🎨', '🎮', '🧩', '🧸', '🪁', '🎸', '⚽', '🏀', '🎾', '🎳', '🎷', '🎹', '🎺', '🎻', '🎤', '🎬',
    '🛹', '🛼', '🚲', '🛵', '🚂', '🚁', '🛸', '🛰️', '🎢', '🎪', '🎠', '🎡', '🎭', '🪄', '🧿', '🧬',
    '🧮', '🔭', '🧪', '🌡️', '🧭', '⚓', '⚔️', '🛡️', '🪀', '🏸', '🏓', '🏉', '🎱', '🎳', '🎯', '🎰'
  ],
};

export interface HighScore {
  name: string;
  score: number;
  difficulty: Difficulty;
  theme: Theme;
  date: string;
}
