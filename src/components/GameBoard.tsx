
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useCallback } from 'react';
import { Tile } from './Tile';
import { Difficulty, Theme, THEMES, ALL_ICONS, DifficultySettings } from '../constants';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../lib/audio';

interface GameBoardProps {
  difficulty: DifficultySettings;
  theme: Theme;
  onGameEnd: (score: number) => void;
  onReturnHome: () => void;
}

interface TileState {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ difficulty, theme: themeName, onGameEnd, onReturnHome }) => {
  const [tiles, setTiles] = useState<TileState[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  const currentTheme = THEMES.find(t => t.name === themeName) || THEMES[0];
  const gridSize = difficulty.gridSize;
  const totalPairs = (gridSize * gridSize) / 2;

  const triggerConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  const initGame = useCallback(() => {
    const iconPool = [...(ALL_ICONS[themeName] || ALL_ICONS.Animals)];
    
    // Shuffle the full pool first to pick random unique icons
    const shuffledPool = iconPool.sort(() => Math.random() - 0.5);
    
    // Pick enough unique icons for the required number of pairs
    const selectedBatch = shuffledPool.slice(0, totalPairs);
    
    const gameTiles: string[] = [];
    selectedBatch.forEach((icon) => {
      gameTiles.push(icon);
      gameTiles.push(icon);
    });

    // Shuffle the final board tiles
    const shuffledBoard = gameTiles
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({
        id,
        icon,
        isFlipped: false,
        isMatched: false,
      }));

    setTiles(shuffledBoard);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setIsGameOver(false);
    setCanFlip(true);
  }, [themeName, totalPairs]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleTileClick = (id: number) => {
    // Initialize audio on first physical interaction in game (safe for mobile)
    audioManager.init();
    
    if (!canFlip || flippedIds.includes(id) || tiles[id].isMatched) return;

    audioManager.playSound('flip');
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setCanFlip(false);
      
      const [firstId, secondId] = newFlipped;
      if (tiles[firstId].icon === tiles[secondId].icon) {
        // Match!
        setTimeout(() => {
          setTiles(prev => prev.map(t => 
            (t.id === firstId || t.id === secondId) ? { ...t, isMatched: true } : t
          ));
          audioManager.playSound('match');
          setMatches(m => m + 1);
          setFlippedIds([]);
          setCanFlip(true);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIds([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matches === totalPairs && totalPairs > 0) {
      setIsGameOver(true);
      triggerConfetti();
      audioManager.playSound('win');
      const score = Math.max(10, 1000 - moves * 10);
      setTimeout(() => onGameEnd(score), 4000);
    }
  }, [matches, totalPairs, moves, onGameEnd, triggerConfetti]);

  return (
    <div className={`min-h-full ${currentTheme.bg} p-8 flex flex-col items-center`}>
      {/* Header Info */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-pink-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-black">★</span>
          </div>
          <h1 className="text-4xl font-black text-pink-500 tracking-tight uppercase">LIAM’S AWESOME TILES</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-6 py-2 rounded-full border-4 border-yellow-200 shadow-sm flex flex-col justify-center">
            <span className="text-gray-400 uppercase text-[10px] font-black block">Best Score</span>
            <span className="text-xl font-black text-yellow-600">
              {localStorage.getItem('tiny_tiles_scores') 
                ? JSON.parse(localStorage.getItem('tiny_tiles_scores') || '[]')[0]?.score || 0 
                : 0}
            </span>
          </div>
          <button 
            onClick={onReturnHome}
            className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-2xl border-b-8 border-blue-600 font-black transition-all flex items-center gap-2"
          >
            <Home size={18} /> EXIT
          </button>
        </div>
      </header>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">
        {/* Sidebar Left: Info */}
        <aside className="w-full lg:w-64 space-y-6 shrink-0">
          <div className="bg-white p-6 rounded-[32px] border-4 border-blue-100 shadow-sm">
            <h2 className="text-blue-500 font-black text-lg mb-4 uppercase tracking-wider">Level</h2>
            <div className="py-4 px-4 bg-blue-500 text-white rounded-2xl font-black text-center shadow-md border-b-4 border-blue-700">
              {difficulty.label.split(' ')[0]}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border-4 border-green-100 shadow-sm">
            <h2 className="text-green-600 font-black text-lg mb-4 uppercase tracking-wider">Theme</h2>
            <div className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-400 rounded-2xl font-bold text-green-700">
              <span className="w-8 h-8 rounded-lg bg-green-400 flex items-center justify-center text-white">
                ★
              </span>
              {themeName}
            </div>
          </div>
        </aside>

        {/* Central Game Board */}
        <section className="flex-1 bg-white/50 rounded-[48px] p-8 md:p-12 border-4 border-white shadow-inner overflow-auto">
          <div 
            className="game-grid grid gap-8 md:gap-10"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            <AnimatePresence>
              {tiles.map((tile) => (
                <Tile
                  key={tile.id}
                  id={tile.id}
                  icon={tile.icon}
                  isFlipped={flippedIds.includes(tile.id)}
                  isMatched={tile.isMatched}
                  onClick={handleTileClick}
                  color={currentTheme.color}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Right: Stats */}
        <aside className="w-full lg:w-48 flex flex-col gap-6 shrink-0">
          <div className="bg-white p-6 rounded-[32px] border-4 border-purple-100 shadow-sm text-center">
            <span className="text-gray-400 text-sm font-bold block uppercase">Moves</span>
            <span className="text-5xl font-black text-purple-600 italic tracking-tighter">{moves}</span>
          </div>

          <div className="bg-white p-6 rounded-[32px] border-4 border-orange-100 shadow-sm text-center">
            <span className="text-gray-400 text-sm font-bold block uppercase tracking-wider">Matches</span>
            <span className="text-4xl font-black text-orange-500">{matches}/{totalPairs}</span>
          </div>

          <button 
            onClick={initGame}
            className="bg-pink-500 hover:bg-pink-600 p-6 rounded-[32px] shadow-lg border-b-8 border-pink-700 text-center transition-all group"
          >
            <span className="text-white font-black text-2xl flex items-center justify-center gap-2">
              <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" /> RESET
            </span>
            <div className="w-full bg-pink-700 h-3 rounded-full mt-3 overflow-hidden">
              <motion.div 
                animate={{ width: `${(matches / totalPairs) * 100}%` }}
                className="bg-white h-full" 
              />
            </div>
          </button>
        </aside>
      </div>

      {/* GameOver Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-yellow-50/80 backdrop-blur-xl flex flex-col items-center justify-center z-50 p-10"
          >
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center border-[12px] border-white ring-8 ring-yellow-200">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-pink-400 w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-lg mb-8"
              >
                <span className="text-white text-6xl font-black">★</span>
              </motion.div>
              <h2 className="text-7xl font-black text-pink-500 tracking-tight mb-2">AMAZING!</h2>
              <p className="text-2xl font-black text-gray-400 uppercase tracking-widest mb-10">Adventure Complete</p>
              
              <div className="flex gap-6">
                <div className="text-center px-10 py-6 bg-purple-50 border-4 border-purple-100 rounded-[2rem]">
                  <span className="block text-sm text-purple-400 font-black uppercase">Final Moves</span>
                  <span className="text-5xl font-black text-purple-600 italic">{moves}</span>
                </div>
                <div className="text-center px-10 py-6 bg-orange-50 border-4 border-orange-100 rounded-[2rem]">
                  <span className="block text-sm text-orange-400 font-black uppercase">Points</span>
                  <span className="text-5xl font-black text-orange-600">{Math.max(10, 1000 - moves * 10)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
