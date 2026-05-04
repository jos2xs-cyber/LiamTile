
import { motion } from 'motion/react';
import React from 'react';

interface TileProps {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  color: string;
}

export const Tile: React.FC<TileProps> = ({ id, icon, isFlipped, isMatched, onClick, color }) => {
  return (
    <div 
      className="relative aspect-square cursor-pointer perspective-1000"
      onClick={() => !isFlipped && !isMatched && onClick(id)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front (Hidden) */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] shadow-lg border-4 border-white bg-blue-400 border-b-[12px] flex items-center justify-center"
        >
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-black text-4xl">?</span>
          </div>
        </div>

        {/* Back (Visible Emoji) */}
        <div 
          className={`absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] shadow-xl border-4 flex items-center justify-center rotate-y-180 transition-all ${
            isMatched 
              ? 'bg-green-100 border-green-400 opacity-60 scale-95' 
              : 'bg-white border-white ring-[10px] ring-white shadow-2xl'
          }`}
        >
          <span className={`text-6xl sm:text-7xl ${isMatched ? 'opacity-80 grayscale-[0.5]' : ''}`}>
            {icon}
          </span>
          
          {isMatched && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 1 }}
              className="absolute text-yellow-400 pointer-events-none"
            >
              ★
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
