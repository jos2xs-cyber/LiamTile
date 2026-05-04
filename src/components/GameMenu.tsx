
import { motion } from 'motion/react';
import React from 'react';
import { Theme, Difficulty, THEMES, DIFFICULTIES, HighScore, ALL_ICONS } from '../constants';
import { Star, Play, Trophy } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface GameMenuProps {
  onStart: (theme: Theme, difficulty: Difficulty) => void;
  highScores: HighScore[];
}

export const GameMenu: React.FC<GameMenuProps> = ({ onStart, highScores }) => {
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>('Animals');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>('Easy');
  const [showScores, setShowScores] = React.useState(false);

  return (
    <div className="min-h-full p-8 flex flex-col items-center">
      {/* Design Header */}
      <header className="w-full max-w-6xl p-8 flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-pink-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-black">★</span>
          </div>
          <h1 className="text-4xl font-black text-pink-500 tracking-tight uppercase">LIAM’S AWESOME TILES</h1>
        </div>

        <div className="flex gap-4">
          <div className="hidden sm:flex bg-white px-6 py-3 rounded-full border-4 border-yellow-200 shadow-sm flex flex-col justify-center">
            <span className="text-gray-400 uppercase text-[10px] font-black block leading-none mb-1">High Score</span>
            <span className="text-xl font-black text-yellow-600 leading-none">
              {highScores[0]?.score || 0}
            </span>
          </div>
          <button 
            onClick={() => setShowScores(!showScores)}
            className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl border-b-8 border-blue-600 font-black transition-all"
          >
            {showScores ? 'HIDE' : 'RECORDS'}
          </button>
        </div>
      </header>

      <div className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row gap-10">
        {/* Sidebar: Game Options */}
        <aside className="w-full lg:w-64 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border-4 border-blue-100 shadow-sm">
            <h2 className="text-blue-500 font-black text-lg mb-4 uppercase tracking-wider">Themes</h2>
            <div className="space-y-3">
              {THEMES.map((theme) => {
                const emoji = ALL_ICONS[theme.name][0];
                const isActive = selectedTheme === theme.name;
                return (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(theme.name)}
                    className={`w-full flex items-center gap-3 p-3 transition-all rounded-2xl font-bold border-2 ${
                      isActive 
                        ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-md translate-x-2' 
                        : 'hover:bg-gray-50 border-transparent text-gray-500'
                    }`}
                  >
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white border-2 text-2xl ${isActive ? 'border-blue-400' : 'border-gray-100'}`}>
                      {emoji}
                    </span> 
                    {theme.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border-4 border-green-100 shadow-sm">
            <h2 className="text-green-600 font-black text-lg mb-4 uppercase tracking-wider">Difficulty</h2>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(DIFFICULTIES) as Difficulty[]).map((level) => {
                const isActive = selectedDifficulty === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`py-3 px-4 rounded-xl font-black transition-all ${
                      isActive 
                        ? 'bg-green-500 text-white shadow-lg border-b-4 border-green-700' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {level.toUpperCase()} ({DIFFICULTIES[level].gridSize}x{DIFFICULTIES[level].gridSize})
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center bg-white/50 rounded-[48px] p-12 border-4 border-white shadow-inner min-h-[400px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-12"
          >
            <div className="bg-blue-400 w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl mx-auto mb-6 border-b-8 border-blue-600">
               <Play className="text-white fill-white ml-2" size={40} />
            </div>
            <h2 className="text-5xl font-black text-gray-800 tracking-tight">READY TO MATCH?</h2>
            <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest">Find all pairs to win</p>
          </motion.div>

          <button
            onClick={() => {
              audioManager.init();
              onStart(selectedTheme, selectedDifficulty);
            }}
            className="w-full max-w-sm h-20 bg-pink-500 hover:bg-pink-600 text-white text-3xl font-black rounded-3xl border-b-8 border-pink-700 shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            START ADVENTURE
          </button>
        </section>

        {/* Right Sidebar: High Scores (Conditional) */}
        {showScores && (
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border-4 border-purple-100 shadow-sm h-full max-h-[600px] overflow-auto">
              <h2 className="text-purple-500 font-black text-lg mb-6 uppercase tracking-wider flex items-center gap-2">
                <Trophy size={18} /> Hall of Fame
              </h2>
              {highScores.length === 0 ? (
                <p className="text-gray-400 italic text-sm">No records yet!</p>
              ) : (
                <div className="space-y-4">
                  {highScores.map((score, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-100 last:border-0 grow">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-black text-gray-800 text-sm">{score.name}</span>
                        <span className="text-purple-600 font-black italic">{score.score}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {score.difficulty} • {score.theme}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      <footer className="w-full max-w-6xl mt-12 px-12 py-6 flex justify-between items-center text-gray-300 font-black uppercase tracking-widest text-xs">
        <span>Tiny Tiles Kid's Edition v2.0</span>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-300" />
          <div className="w-2 h-2 rounded-full bg-pink-300" />
          <div className="w-2 h-2 rounded-full bg-yellow-300" />
        </div>
      </footer>
    </div>
  );
};
