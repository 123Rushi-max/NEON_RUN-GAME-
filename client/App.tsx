import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, INITIAL_LIVES } from './constants';
import { Player } from './game/Entities';
import { levelFactories, LevelData } from './game/World';
import { checkPlatformCollisions, checkEnemyCollisions, checkCoinCollisions } from './game/Physics';
import HUD from './components/UI/HUD';
import Menu from './components/UI/Menu';
import MobileControls from './components/UI/MobileControls';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
};

type TrailPoint = { x: number; y: number; alpha: number };

const MAX_TRAIL = 16;
const totalLevels = levelFactories.length;

const createStars = () =>
  Array.from({ length: 60 }, () => ({
    x: Math.random() * 6000,
    y: Math.random() * CANVAS_HEIGHT,
    size: 1 + Math.random() * 2,
  }));

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progress, setProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>(GameState.START);

  // Input Refs
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mobileKeysRef = useRef<{ [key: string]: boolean }>({});

  // Game Objects
  const playerRef = useRef<Player>(new Player(50, 400));
  const worldRef = useRef<LevelData>(levelFactories[0]());
  const cameraXRef = useRef(0);

  // FX
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number }[]>(createStars());
  const shakeRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const spawnParticles = useCallback((x: number, y: number, count: number, color: string, size = 6, speed = 3) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed * Math.random(),
        vy: Math.sin(angle) * speed * Math.random(),
        life: 1,
        size: size * (0.5 + Math.random() * 0.5),
        color,
      });
    }
  }, []);

  const initGame = useCallback((level: number = 1, opts?: { preserveScore?: boolean; preserveLives?: boolean }) => {
    const safeLevel = Math.min(Math.max(level, 1), totalLevels);
    keysRef.current = {};
    mobileKeysRef.current = {};
    playerRef.current = new Player(100, 380);
    worldRef.current = levelFactories[safeLevel - 1]();
    cameraXRef.current = 0;
    particlesRef.current = [];
    trailRef.current = [];
    shakeRef.current = 0;
    setCurrentLevel(safeLevel);
    setProgress(0);
    if (!opts?.preserveScore) setScore(0);
    if (!opts?.preserveLives) setLives(INITIAL_LIVES);
    setGameState(GameState.PLAYING);
  }, []);

  const handlePause = useCallback(() => {
    if (gameState === GameState.PLAYING) setGameState(GameState.PAUSED);
  }, [gameState]);

  const handleResume = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const handleMobileInput = useCallback((key: string, pressed: boolean) => {
    mobileKeysRef.current[key] = pressed;
  }, []);

  const handleRestartLevel = useCallback(() => {
    initGame(currentLevel);
  }, [currentLevel, initGame]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < totalLevels) {
      setLives((l) => Math.min(INITIAL_LIVES, l + 1));
      initGame(currentLevel + 1, { preserveScore: true, preserveLives: true });
    }
  }, [currentLevel, initGame]);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current === GameState.PLAYING) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const player = playerRef.current;
      const { platforms, enemies, coins, finishLine, theme } = worldRef.current;

      const combinedKeys = { ...keysRef.current, ...mobileKeysRef.current };

      // 1. Update Player
      player.update(combinedKeys);
      trailRef.current.unshift({ x: player.x, y: player.y, alpha: 0.5 });
      trailRef.current = trailRef.current.slice(0, MAX_TRAIL).map((p, i) => ({ ...p, alpha: Math.max(0, p.alpha - 0.04 * (i + 1)) }));

      // 2. Physics & Collisions
      checkPlatformCollisions(player, platforms);
      checkEnemyCollisions(
        player,
        enemies,
        () => {
          shakeRef.current = 10;
          spawnParticles(player.x, player.y, 20, '#f43f5e', 6, 4);
          setLives((prev) => {
            if (prev <= 1) {
              setGameState(GameState.GAME_OVER);
              return 0;
            }
            player.x -= 200;
            player.y = 120;
            player.vx = 0;
            return prev - 1;
          });
        },
        (enemy) => {
          enemy.isDead = true;
          shakeRef.current = Math.max(shakeRef.current, 6);
          spawnParticles(enemy.x, enemy.y, 24, COLORS.ENEMY, 6, 5);
          setScore((s) => s + 500);
        }
      );
      checkCoinCollisions(player, coins, (coin) => {
        coin.collected = true;
        spawnParticles(coin.x, coin.y, 12, COLORS.COIN, 5, 3);
        setScore((s) => s + 100);
      });

      // 3. World Logic
      enemies.forEach((e) => e.update());
      coins.forEach((c) => c.update());

      if (player.y > CANVAS_HEIGHT + 220) {
        setGameState(GameState.GAME_OVER);
      }

      if (player.x > finishLine) {
        setScore((s) => s + 250 * currentLevel);
        setGameState(GameState.LEVEL_COMPLETE);
        gameStateRef.current = GameState.LEVEL_COMPLETE;
      }

      // 4. Camera Follow
      const targetCamX = player.x - CANVAS_WIDTH / 3;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.1;
      cameraXRef.current = Math.max(0, cameraXRef.current);

      // 5. FX updates
      particlesRef.current = particlesRef.current
        .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - 0.02 }))
        .filter((p) => p.life > 0);
      if (shakeRef.current > 0) shakeRef.current *= 0.9;

      // 6. Progress bar sync
      const nextProgress = Math.min(1, player.x / finishLine);
      setProgress((prev) => (Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev));

      // 7. Drawing
      const shakeX = (Math.random() - 0.5) * shakeRef.current;
      const shakeY = (Math.random() - 0.5) * shakeRef.current;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, theme.skyTop);
      gradient.addColorStop(1, theme.skyBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parallax stars
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      starsRef.current.forEach((s) => {
        const sx = s.x - cameraXRef.current * 0.2;
        const sy = s.y + Math.sin(Date.now() / 1000 + s.x) * 2;
        ctx.fillRect((sx % (canvas.width + 2000)) - 200, sy, s.size, s.size);
      });

      // Neon scanlines
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let y = 0; y < canvas.height; y += 8) ctx.fillRect(0, y, canvas.width, 1);

      // Trail behind player
      trailRef.current.forEach((t) => {
        ctx.globalAlpha = t.alpha;
        ctx.fillStyle = theme.accent;
        ctx.fillRect(t.x - cameraXRef.current, t.y, 32, 32);
      });
      ctx.globalAlpha = 1;

      platforms.forEach((p) => p.draw(ctx, cameraXRef.current));
      coins.forEach((c) => c.draw(ctx, cameraXRef.current));
      enemies.forEach((e) => e.draw(ctx, cameraXRef.current));
      player.draw(ctx, cameraXRef.current);

      particlesRef.current.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x - cameraXRef.current, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.restore();
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [currentLevel, initGame, spawnParticles]);

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
        
        <HUD 
          score={score} 
          lives={lives} 
          level={currentLevel}
          totalLevels={totalLevels}
          progress={progress}
          onPause={handlePause} 
        />
        
        <Menu 
          state={gameState} 
          score={score} 
          currentLevel={currentLevel}
          totalLevels={totalLevels}
          onStart={() => initGame(1)} 
          onResume={handleResume} 
          onRestart={handleRestartLevel}
          onNextLevel={handleNextLevel}
        />

        {gameState === GameState.PLAYING && (
           <MobileControls onInput={handleMobileInput} />
        )}
      </div>
    </div>
  );
};

export default App;
