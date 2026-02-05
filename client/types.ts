
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE'
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector2D;
  size: Vector2D;
  vel: Vector2D;
}

export interface Platform extends Entity {
  color: string;
}

export interface Collectible extends Entity {
  collected: boolean;
  value: number;
}

export interface Enemy extends Entity {
  type: 'patrol' | 'jump';
  isDead: boolean;
  patrolRange: number;
  startX: number;
}

export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}
