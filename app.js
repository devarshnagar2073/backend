import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';
import { connectDB } from './utils/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ---------------- CORS ---------------- */

// allow localhost + vercel domains
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://frontend-nu-lake-qjwev0yboh.vercel.app/"
    ],
    credentials: true
  })
);


/* ---------------- STATIC (optional) ---------------- */

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------------- DB ---------------- */

connectDB();

/* ---------------- ROUTES ---------------- */

app.use('/api', indexRouter);

/* ---------------- 404 ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
