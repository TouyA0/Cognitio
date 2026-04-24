import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({ message: 'Cognitio API v1' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});