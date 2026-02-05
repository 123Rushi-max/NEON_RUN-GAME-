
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
