import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/index.js';

const app = express();

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use('/api/v1', apiRouter);

// Health check route
app.get("/health", (_, res) => {
    res.status(200).json({ status: "ok" });
});

export { app };
