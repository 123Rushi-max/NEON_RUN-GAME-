
import { Platform, Enemy, Coin } from './Entities';

export type LevelData = {
  platforms: Platform[];
  enemies: Enemy[];
  coins: Coin[];
  finishLine: number;
  name: string;
  theme: {
    skyTop: string;
    skyBottom: string;
    accent: string;
  };
};

export function createLevel1(): LevelData {
  const platforms = [
    new Platform(0, 500, 1000, 100), // Ground
    new Platform(1200, 500, 800, 100), // Gap jump
    new Platform(200, 350, 200, 40),
    new Platform(500, 250, 200, 40),
    new Platform(850, 200, 300, 40),
    new Platform(1400, 350, 200, 40),
    new Platform(1700, 250, 200, 40),
    new Platform(2100, 500, 1500, 100), // Large end ground
  ];

  const enemies = [
    new Enemy(600, 460, 150),
    new Enemy(1400, 460, 200),
    new Enemy(2200, 460, 300),
    new Enemy(2800, 460, 200),
  ];

  const coins = [
    new Coin(300, 300),
    new Coin(550, 200),
    new Coin(950, 150),
    new Coin(1500, 300),
    new Coin(1800, 200),
    new Coin(2500, 450),
    new Coin(2600, 450),
    new Coin(2700, 450),
  ];

  return {
    platforms,
    enemies,
    coins,
    finishLine: 3500,
    name: 'Neon District',
    theme: { skyTop: '#0f172a', skyBottom: '#111827', accent: '#22d3ee' }
  };
}

export function createLevel2(): LevelData {
  const platforms = [
    new Platform(0, 500, 600, 100),   // Start ground 
    new Platform(800, 350, 150, 30),  // Mushkil jump 1
    new Platform(1100, 250, 150, 30), // Mushkil jump 2
    new Platform(1400, 400, 200, 40), 
    
    // Floating challenge
    new Platform(1800, 300, 100, 20), 
    new Platform(2100, 200, 100, 20),
    new Platform(2400, 300, 100, 20),
    
    new Platform(2700, 500, 800, 100), // Middle Ground
    
    // Zig-zag platforms
    new Platform(3600, 400, 120, 30),
    new Platform(3900, 250, 120, 30),
    new Platform(4200, 500, 1000, 100), // Final Ground
  ];

  const enemies = [
    new Enemy(400, 460, 100),
    new Enemy(2800, 460, 300), // Fast patrol
    new Enemy(3200, 460, 200),
    new Enemy(4400, 460, 400), // Final Boss Enemy
  ];

  const coins = [
    new Coin(850, 300),
    new Coin(1150, 200),
    new Coin(2100, 150),
    new Coin(3950, 200),
    new Coin(4500, 450),
  ];

  return {
    platforms,
    enemies,
    coins,
    finishLine: 5000,
    name: 'Synth Peaks',
    theme: { skyTop: '#120c24', skyBottom: '#25114b', accent: '#f472b6' }
  };
}

export function createLevel3(): LevelData {
  const platforms = [
    new Platform(0, 520, 700, 100),
    new Platform(780, 420, 200, 30),
    new Platform(1100, 320, 180, 30),
    new Platform(1450, 220, 180, 30),
    new Platform(1800, 320, 220, 30),
    new Platform(2150, 420, 220, 30),
    new Platform(2500, 520, 900, 100),

    // skyscraper rooftops
    new Platform(3500, 420, 150, 30),
    new Platform(3720, 300, 150, 30),
    new Platform(3940, 180, 150, 30),
    new Platform(4160, 300, 150, 30),
    new Platform(4380, 420, 150, 30),
    new Platform(4700, 520, 800, 100)
  ];

  const enemies = [
    new Enemy(500, 480, 120),
    new Enemy(1250, 280, 80),
    new Enemy(2300, 480, 160),
    new Enemy(3300, 480, 260),
    new Enemy(4300, 380, 140),
    new Enemy(4900, 480, 320)
  ];

  const coins = [
    new Coin(820, 360),
    new Coin(1140, 260),
    new Coin(1490, 170),
    new Coin(1840, 260),
    new Coin(2190, 360),
    new Coin(3600, 360),
    new Coin(3820, 240),
    new Coin(4040, 120),
    new Coin(4260, 240),
    new Coin(4480, 360),
    new Coin(5200, 480),
  ];

  return {
    platforms,
    enemies,
    coins,
    finishLine: 5400,
    name: 'Skyline Run',
    theme: { skyTop: '#0a1a2f', skyBottom: '#0d3b66', accent: '#7dd3fc' }
  };
}

export function createLevel4(): LevelData {
  const platforms = [
    new Platform(0, 520, 600, 100),
    new Platform(750, 440, 180, 30),
    new Platform(1050, 360, 180, 30),
    new Platform(1350, 280, 180, 30),
    new Platform(1650, 360, 180, 30),
    new Platform(1950, 440, 180, 30),
    new Platform(2250, 520, 900, 100),

    // comet field
    new Platform(3300, 360, 140, 26),
    new Platform(3500, 460, 140, 26),
    new Platform(3700, 360, 140, 26),
    new Platform(3900, 460, 140, 26),
    new Platform(4100, 360, 140, 26),
    new Platform(4300, 520, 1000, 100)
  ];

  const enemies = [
    new Enemy(500, 480, 140),
    new Enemy(1200, 320, 90),
    new Enemy(2000, 480, 180),
    new Enemy(2600, 480, 220),
    new Enemy(3420, 320, 120),
    new Enemy(3820, 420, 120),
    new Enemy(4220, 320, 120),
    new Enemy(4700, 480, 360),
  ];

  const coins = [
    new Coin(800, 380),
    new Coin(1100, 300),
    new Coin(1400, 220),
    new Coin(1700, 300),
    new Coin(2000, 380),
    new Coin(2350, 460),
    new Coin(3450, 300),
    new Coin(3650, 400),
    new Coin(3850, 300),
    new Coin(4050, 400),
    new Coin(4250, 300),
    new Coin(4550, 480),
    new Coin(5000, 480),
  ];

  return {
    platforms,
    enemies,
    coins,
    finishLine: 5200,
    name: 'Cosmic Drift',
    theme: { skyTop: '#0b1224', skyBottom: '#0a223f', accent: '#a855f7' }
  };
}

export const levelFactories = [createLevel1, createLevel2, createLevel3, createLevel4];
