import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/index.js';

const app = express();

// CORS Configuration
app.use(cors({
    origin: "https://tark-vitark.vercel.app",
    credentials: true
}));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use('/api/v1', apiRouter);

// temp route for testing purposes
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Health check route
app.get("/health", (_, res) => {
    res.status(200).json({ status: "ok" });
});

export { app };
