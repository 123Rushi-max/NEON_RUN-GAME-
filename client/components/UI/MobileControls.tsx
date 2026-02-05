// client/src/components/UI/MobileControls.tsx

import React from 'react';

interface MobileControlsProps {
  onInput: (key: string, pressed: boolean) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onInput }) => {
  
  // Jab screen touch ho
  const handleTouchStart = (key: string) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // Browser ka zoom/scroll rokne ke liye
    onInput(key, true);
  };

  // Jab ungli hata li jaye
  const handleTouchEnd = (key: string) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onInput(key, false);
  };

  return (
    <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between items-end pointer-events-none select-none z-50">
      
      {/* LEFT / RIGHT CONTROLS */}
      <div className="flex gap-4 pointer-events-auto">
        {/* Left Button */}
        <button
          className="w-16 h-16 bg-slate-800/80 border-2 border-cyan-500/50 rounded-full flex items-center justify-center active:bg-cyan-500/30 touch-none"
          onTouchStart={handleTouchStart('ArrowLeft')}
          onTouchEnd={handleTouchEnd('ArrowLeft')}
          onMouseDown={handleTouchStart('ArrowLeft')} // For testing on PC mouse
          onMouseUp={handleTouchEnd('ArrowLeft')}
        >
          <span className="text-3xl text-cyan-400">←</span>
        </button>

        {/* Right Button */}
        <button
          className="w-16 h-16 bg-slate-800/80 border-2 border-cyan-500/50 rounded-full flex items-center justify-center active:bg-cyan-500/30 touch-none"
          onTouchStart={handleTouchStart('ArrowRight')}
          onTouchEnd={handleTouchEnd('ArrowRight')}
          onMouseDown={handleTouchStart('ArrowRight')}
          onMouseUp={handleTouchEnd('ArrowRight')}
        >
          <span className="text-3xl text-cyan-400">→</span>
        </button>
      </div>

      {/* JUMP BUTTON */}
      <div className="pointer-events-auto">
        <button
          className="w-20 h-20 bg-slate-800/80 border-2 border-rose-500/50 rounded-full flex items-center justify-center active:bg-rose-500/30 touch-none"
          onTouchStart={handleTouchStart('ArrowUp')}
          onTouchEnd={handleTouchEnd('ArrowUp')}
          onMouseDown={handleTouchStart('ArrowUp')}
          onMouseUp={handleTouchEnd('ArrowUp')}
        >
          <span className="text-xl font-bold text-rose-400">JUMP</span>
        </button>
      </div>
    </div>
  );
};

export default MobileControls;