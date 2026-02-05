
// Fix: Imported Vector2D from the correct module '../types' and removed it from '../constants'
import { PHYSICS, PLAYER_SIZE, COLORS, ENEMY_SIZE } from '../constants';
import { Vector2D } from '../types';

// Entities.ts

export class Player {
  x: number;
  y: number;
  width: number = PLAYER_SIZE.width;
  height: number = PLAYER_SIZE.height;
  vx: number = 0;
  vy: number = 0;
  isJumping: boolean = false;
  color: string = COLORS.PLAYER;
  lives: number = 3;

  // NEW: Double Jump variables
  jumpCount: number = 0;
  maxJumps: number = 2; // 1 = normal, 2 = double jump
  wasJumpKeyDown: boolean = false; // To prevent "holding" the key

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(keys: { [key: string]: boolean }) {
    // Horizontal Movement (Same as before)
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      if (this.vx < PHYSICS.MAX_SPEED) this.vx += PHYSICS.WALK_SPEED;
    } else if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      if (this.vx > -PHYSICS.MAX_SPEED) this.vx -= PHYSICS.WALK_SPEED;
    } else {
     this.vx *= 0.8; // 0.8 ya 0.7 rakho taaki player turant ruk jaye
    if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    // --- NEW JUMP LOGIC ---
    const isJumpKeyPressed = keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' '];

    // Only jump if the key is pressed NOW but wasn't pressed in the LAST frame
    if (isJumpKeyPressed && !this.wasJumpKeyDown) {
      if (this.jumpCount < this.maxJumps) {
        this.vy = PHYSICS.JUMP_POWER; // Apply upward force
        this.jumpCount++;             // Count the jump
        this.isJumping = true;
      }
    }
    
    // Remember the key state for the next frame
    this.wasJumpKeyDown = isJumpKeyPressed;
    // ----------------------

    // Gravity
    this.vy += PHYSICS.GRAVITY;

    // Apply Velocity
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    // (Keep your existing draw code here)
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    
    ctx.fillStyle = 'white';
    const eyeX = this.vx >= 0 ? 25 : 5;
    ctx.fillRect(this.x - cameraX + eyeX, this.y + 10, 8, 8);
    ctx.shadowBlur = 0;
  }
}


export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(x: number, y: number, width: number, height: number, color: string = COLORS.PLATFORM) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    
    // Platform highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(this.x - cameraX, this.y, this.width, 5);
  }
}

export class Enemy {
  x: number;
  y: number;
  startX: number;
  width: number = ENEMY_SIZE.width;
  height: number = ENEMY_SIZE.height;
  vx: number = 2;
  patrolRange: number = 100;
  isDead: boolean = false;

  constructor(x: number, y: number, range: number) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.patrolRange = range;
  }

  update() {
    if (this.isDead) return;
    
    this.x += this.vx;
    
    if (Math.abs(this.x - this.startX) > this.patrolRange) {
      this.vx *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    if (this.isDead) return;
    
    ctx.fillStyle = COLORS.ENEMY;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.ENEMY;
    ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    
    // Angry eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x - cameraX + 5, this.y + 10, 10, 5);
    ctx.fillRect(this.x - cameraX + 25, this.y + 10, 10, 5);
    
    ctx.shadowBlur = 0;
  }
}

export class Coin {
  x: number;
  y: number;
  width: number = 20;
  height: number = 20;
  collected: boolean = false;
  floatOffset: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.floatOffset = Math.sin(Date.now() / 200) * 5;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    if (this.collected) return;
    
    ctx.fillStyle = COLORS.COIN;
    ctx.beginPath();
    ctx.arc(this.x - cameraX + 10, this.y + 10 + this.floatOffset, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Sparkle
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x - cameraX + 8, this.y + 8 + this.floatOffset, 4, 4);
  }
}