
import React from 'react';

interface HUDProps {
  score: number;
  lives: number;
  onPause: () => void;
}

const HUD: React.FC<HUDProps> = ({ score, lives, onPause }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none select-none">
      <div className="flex flex-col gap-2">
        <div className="pixel-font text-white text-xl flex items-center gap-4">
          <span className="text-cyan-400">SCORE:</span> {score.toString().padStart(6, '0')}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded ${
                i < lives ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-slate-700'
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPause();
        }}
        className="pointer-events-auto bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 transition-colors"
      >
        PAUSE [ESC]
      </button>
    </div>
  );
};

export default HUD;
