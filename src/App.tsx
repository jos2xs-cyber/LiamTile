/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMenu } from './components/GameMenu';
import { GameBoard } from './components/GameBoard';
import { Theme, Difficulty, DIFFICULTIES, HighScore } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Music2 } from 'lucide-react';
import { audioManager } from './lib/audio';

type Screen = 'menu' | 'game' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [theme, setTheme] = useState<Theme>('Animals');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  // Load high scores
  useEffect(() => {
    const saved = localStorage.getItem('tiny_tiles_scores');
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, []);

  const handleStartGame = (selectedTheme: Theme, selectedDifficulty: Difficulty) => {
    setTheme(selectedTheme);
    setDifficulty(selectedDifficulty);
    setScreen('game');
  };

  const handleGameEnd = (score: number) => {
    const newHighScore: HighScore = {
      name: 'Super Player',
      score,
      difficulty,
      theme,
      date: new Date().toISOString(),
    };

    const updatedScores = [...highScores, newHighScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setHighScores(updatedScores);
    localStorage.setItem('tiny_tiles_scores', JSON.stringify(updatedScores));
    
    // Auto return to menu after delay (GameBoard handles its own celebration)
    setTimeout(() => setScreen('menu'), 4000);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 flex flex-col">
      {/* Global Music Toggle */}
      <div className="fixed top-8 right-8 z-50 flex gap-4">
        <button
          onClick={() => {
            const nextState = !isMusicEnabled;
            setIsMusicEnabled(nextState);
            audioManager.toggleMusic(nextState);
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 border-gray-200 ${
            isMusicEnabled ? 'bg-white text-blue-500 shadow-md' : 'bg-white text-gray-300'
          }`}
        >
          {isMusicEnabled ? <Music2 className="w-6 h-6 animate-pulse" /> : <Music className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex-1 overflow-auto border-[12px] border-white bg-yellow-50 flex flex-col">
        <AnimatePresence mode="wait">
          {screen === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1"
            >
              <GameMenu onStart={handleStartGame} highScores={highScores} />
            </motion.div>
          )}

          {screen === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <GameBoard 
                theme={theme} 
                difficulty={DIFFICULTIES[difficulty]} 
                onGameEnd={handleGameEnd}
                onReturnHome={() => setScreen('menu')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Atmosphere (Visual) */}
      {isMusicEnabled && (
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 animate-gradient" />
        </div>
      )}
    </div>
  );
}

