import { Player, Platform, Enemy, Coin } from './Entities';

export function checkPlatformCollisions(player: Player, platforms: Platform[]) {
  let onGround = false;

  platforms.forEach(platform => {
    // AABB Collision Detection
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y
    ) {
      // Collision occurred, resolve it
      const fromTop = player.y + player.height - platform.y;
      const fromBottom = platform.y + platform.height - player.y;
      const fromLeft = player.x + player.width - platform.x;
      const fromRight = platform.x + platform.width - player.x;

      const min = Math.min(fromTop, fromBottom, fromLeft, fromRight);

      if (min === fromTop && player.vy >= 0) {
        // LANDING LOGIC
        player.y = platform.y - player.height;
        player.vy = 0;
        player.isJumping = false;
        player.jumpCount = 0; // <--- RESET DOUBLE JUMP HERE
        onGround = true;
      } else if (min === fromBottom) {
        // Hitting head on bottom of platform
        player.y = platform.y + platform.height;
        player.vy = 0;
      } else if (min === fromLeft) {
        // Hitting left side
        player.x = platform.x - player.width;
        player.vx = 0;
      } else if (min === fromRight) {
        // Hitting right side
        player.x = platform.x + platform.width;
        player.vx = 0;
      }
    }
  });

  // If we are not on the ground and moving vertically, we are technically "jumping" or falling
  if (!onGround && player.vy !== 0) {
    player.isJumping = true;
  }
}

export function checkEnemyCollisions(player: Player, enemies: Enemy[], onHit: () => void, onKill: (e: Enemy) => void) {
  enemies.forEach(enemy => {
    if (enemy.isDead) return;

    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // Jumped on top of enemy?
      if (player.vy > 0 && player.y + player.height < enemy.y + enemy.height / 2) {
        onKill(enemy);
        player.vy = -10; // Bounce up
      } else {
        onHit();
      }
    }
  });
}

export function checkCoinCollisions(player: Player, coins: Coin[], onCollect: (c: Coin) => void) {
  coins.forEach(coin => {
    if (coin.collected) return;

    if (
      player.x < coin.x + coin.width &&
      player.x + player.width > coin.x &&
      player.y < coin.y + coin.height &&
      player.y + player.height > coin.y
    ) {
      onCollect(coin);
    }
  });
}