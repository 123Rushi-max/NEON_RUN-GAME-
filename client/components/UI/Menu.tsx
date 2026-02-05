
import React, { useState, useEffect } from 'react';
import { GameState, ScoreEntry } from '../../types';
import { ScoreService } from '../../services/api';

interface MenuProps {
  state: GameState;
  score: number;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const Menu: React.FC<MenuProps> = ({ state, score, onStart, onResume, onRestart }) => {
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    ScoreService.getLeaderboard().then(setLeaderboard);
  }, [state]);

  const handleSave = async () => {
    if (!name.trim()) return;
    await ScoreService.saveScore({
      name,
      score,
      date: new Date().toISOString()
    });
    setSaved(true);
    const updated = await ScoreService.getLeaderboard();
    setLeaderboard(updated);
  };

  if (state === GameState.PLAYING) return null;

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border-2 border-slate-700 p-8 rounded-2xl shadow-2xl">
        
        {state === GameState.START && (
          <div className="text-center">
            <h1 className="pixel-font text-4xl text-cyan-400 mb-8 animate-pulse">NEON LEAP</h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Navigate the neon platforms, collect amber fragments, and avoid the rogue rose entities.
            </p>
            <div className="space-y-4 mb-8 text-sm text-left bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between"><span className="text-slate-400">MOVE:</span> <span className="text-white">A / D or Arrow Keys</span></div>
              <div className="flex justify-between"><span className="text-slate-400">JUMP:</span> <span className="text-white">SPACE or W or Up</span></div>
              <div className="flex justify-between"><span className="text-slate-400">PAUSE:</span> <span className="text-white">ESC</span></div>
            </div>
            <button
              onClick={onStart}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              START GAME
            </button>
          </div>
        )}

        {state === GameState.PAUSED && (
          <div className="text-center">
            <h2 className="pixel-font text-3xl text-amber-400 mb-8">PAUSED</h2>
            <div className="space-y-4">
              <button
                onClick={onResume}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-xl"
              >
                RESUME
              </button>
              <button
                onClick={onRestart}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl"
              >
                RESTART
              </button>
            </div>
          </div>
        )}

        {state === GameState.GAME_OVER && (
          <div className="text-center">
            <h2 className="pixel-font text-3xl text-rose-500 mb-4">GAME OVER</h2>
            <p className="text-slate-400 mb-6">You ran out of lives or fell too far.</p>
            <div className="text-4xl text-white font-bold mb-8">
              SCORE: <span className="text-cyan-400">{score}</span>
            </div>

            {!saved ? (
              <div className="mb-8 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={handleSave}
                  className="bg-cyan-500 text-slate-950 px-6 font-bold rounded-lg"
                >
                  SAVE
                </button>
              </div>
            ) : (
              <p className="text-green-400 mb-8">Score Saved!</p>
            )}

            <button
              onClick={onRestart}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-xl mb-8"
            >
              PLAY AGAIN
            </button>

            <div className="text-left border-t border-slate-800 pt-6">
              <h3 className="pixel-font text-sm text-slate-500 mb-4">LEADERBOARD</h3>
              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                    <span className="text-white">{i + 1}. {entry.name}</span>
                    <span className="text-cyan-400 font-mono">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {state === GameState.LEVEL_COMPLETE && (
          <div className="text-center">
            <h2 className="pixel-font text-3xl text-green-400 mb-8">LEVEL CLEARED!</h2>
            <div className="text-4xl text-white font-bold mb-8">
              TOTAL SCORE: <span className="text-cyan-400">{score}</span>
            </div>
            <button
              onClick={onRestart}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-xl"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
