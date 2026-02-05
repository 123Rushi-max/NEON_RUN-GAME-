import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, INITIAL_LIVES } from './constants';
import { Player } from './game/Entities';
import { createLevel1 } from './game/World';
import { checkPlatformCollisions, checkEnemyCollisions, checkCoinCollisions } from './game/Physics';
import HUD from './components/UI/HUD';
import Menu from './components/UI/Menu';
import MobileControls from './components/UI/MobileControls'; // <--- NEW IMPORT

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>(GameState.START);
  
  // Input Refs
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mobileKeysRef = useRef<{ [key: string]: boolean }>({}); // <--- NEW REF FOR TOUCH

  // Game Objects
  const playerRef = useRef<Player>(new Player(50, 400));
  const worldRef = useRef(createLevel1());
  const cameraXRef = useRef(0);

  // Sync state to ref for loop access
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const initGame = useCallback(() => {
    playerRef.current = new Player(100, 400);
    worldRef.current = createLevel1();
    cameraXRef.current = 0;
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameState(GameState.PLAYING);
  }, []);

  const handlePause = useCallback(() => {
    if (gameState === GameState.PLAYING) setGameState(GameState.PAUSED);
  }, [gameState]);

  const handleResume = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  // <--- NEW HELPER FOR MOBILE INPUT
  const handleMobileInput = useCallback((key: string, pressed: boolean) => {
    mobileKeysRef.current[key] = pressed;
  }, []);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current === GameState.PLAYING) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const player = playerRef.current;
      const { platforms, enemies, coins, finishLine } = worldRef.current;

      // <--- MERGE INPUTS (KEYBOARD + TOUCH)
      const combinedKeys = { ...keysRef.current, ...mobileKeysRef.current };
      
      // 1. Update Player with combined inputs
      player.update(combinedKeys);

      // 2. Physics & Collisions
      checkPlatformCollisions(player, platforms);
      checkEnemyCollisions(
        player,
        enemies,
        () => {
          // On Hit
          setLives(prev => {
            if (prev <= 1) {
              setGameState(GameState.GAME_OVER);
              return 0;
            }
            // Reset player position on hit
            player.x -= 200;
            player.y = 100;
            player.vx = 0;
            return prev - 1;
          });
        },
        (enemy) => {
          // On Enemy Kill
          enemy.isDead = true;
          setScore(s => s + 500);
        }
      );
      checkCoinCollisions(player, coins, (coin) => {
        coin.collected = true;
        setScore(s => s + 100);
      });

      // 3. World Logic (Enemies & Level bounds)
      enemies.forEach(e => e.update());
      coins.forEach(c => c.update());

      // Death bounds (fell off map)
      if (player.y > CANVAS_HEIGHT + 200) {
         setGameState(GameState.GAME_OVER);
      }

      // Finish Line
      if (player.x > finishLine) {
        setGameState(GameState.LEVEL_COMPLETE);
      }

      // 4. Camera Follow
      const targetCamX = player.x - CANVAS_WIDTH / 3;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.1;
      cameraXRef.current = Math.max(0, cameraXRef.current);

      // 5. Drawing
      ctx.fillStyle = COLORS.BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parallax Background Stars (Simulated)
      ctx.fillStyle = 'white';
      for(let i=0; i<50; i++) {
        const sx = (i * 137.5) % 3000;
        const sy = (i * 123.4) % 600;
        ctx.fillRect(sx - cameraXRef.current * 0.2, sy, 2, 2);
      }

      platforms.forEach(p => p.draw(ctx, cameraXRef.current));
      coins.forEach(c => c.draw(ctx, cameraXRef.current));
      enemies.forEach(e => e.draw(ctx, cameraXRef.current));
      player.draw(ctx, cameraXRef.current);
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === 'Escape') {
        if (gameStateRef.current === GameState.PLAYING) setGameState(GameState.PAUSED);
        else if (gameStateRef.current === GameState.PAUSED) setGameState(GameState.PLAYING);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans relative">
      <div className="relative shadow-2xl border-4 border-slate-800 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block bg-slate-900"
        />
        
        <HUD score={score} lives={lives} onPause={handlePause} />
        
        <Menu 
          state={gameState} 
          score={score} 
          onStart={initGame} 
          onResume={handleResume} 
          onRestart={initGame}
        />

        {/* <--- MOBILE CONTROLS (Only visible when playing) */}
        {gameState === GameState.PLAYING && (
           <MobileControls onInput={handleMobileInput} />
        )}
      </div>
    </div>
  );
};

export default App;