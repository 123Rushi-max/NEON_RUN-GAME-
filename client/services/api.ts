import { ScoreEntry } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const ScoreService = {
  async saveScore(entry: ScoreEntry): Promise<void> {
    await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });
  },

  async getLeaderboard(): Promise<ScoreEntry[]> {
    const res = await fetch(`${API_URL}/scores`);
    return res.json();
  }
};
