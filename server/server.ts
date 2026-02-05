
/**
 * NOTE: This is an Express.js template for the backend part of your college project.
 * In this sandbox environment, the frontend uses localStorage, but you can deploy 
 * this code to a Node environment (e.g., Render, Heroku) and connect the frontend to it.
 */

/*
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Schema
const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Endpoints
app.get('/api/scores', async (req: Request, res: Response) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scores' });
  }
});

app.post('/api/scores', async (req: Request, res: Response) => {
  const { name, score } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ message: 'Name and score are required' });
  }
  
  try {
    const newScore = new Score({ name, score });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ message: 'Error saving score' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// TEMP in-memory storage (DB later)
let scores: any[] = [];

// Save score
app.post("/scores", (req, res) => {
  const { name, score } = req.body;

  if (!name || score === undefined) {
    return res.status(400).json({ message: "Invalid data" });
  }

  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);

  res.status(201).json({ message: "Score saved" });
});

// Get leaderboard
app.get("/scores", (_req, res) => {
  res.json(scores);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
