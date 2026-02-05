
import { Platform, Enemy, Coin } from './Entities';
import { CANVAS_HEIGHT } from '../constants';

export function createLevel1() {
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

  return { platforms, enemies, coins, finishLine: 3500 };
}

export function createLevel2() {
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

  return { platforms, enemies, coins, finishLine: 5000 };
}