import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import urlRouter from './src/routes/url.js';
import adminRouter from './src/routes/admin.js';

const app = express();

// Environment
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Basic validation of required env vars
// Allow dev fallback to in-memory Mongo if no URI and not production
let memoryServer = null;
if (!MONGODB_URI && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
  console.warn('MONGODB_URI not set – starting in-memory MongoDB (development fallback).');
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(morgan('dev'));
app.use(cors({ origin: FRONTEND_ORIGIN.split(',').map(s => s.trim()), credentials: false }));

// Routes
app.use('/api/shorten', urlRouter); // POST endpoint
app.use('/api/admin', adminRouter); // Admin endpoints (API key protected)
app.get('/', (_req, res) => {
  res.json({ status: 'ok', name: 'LinkSnap API', timestamp: new Date().toISOString() });
});

// Redirect handler (placed after API routes)
import Link from './src/models/Link.js';
app.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    if (!code || code.length > 32) return res.status(400).json({ error: 'Invalid code.' });
    const link = await Link.findOne({ $or: [{ code }, { alias: code }] });
    if (!link) return res.status(404).json({ error: 'Link not found.' });
    if (link.expiresAt && link.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Link expired.' });
    }
    link.clicks += 1;
    await link.save();
    return res.redirect(302, link.originalUrl);
  } catch (err) {
    next(err);
  }
});

// 404 for unknown API paths
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
  next();
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Connect DB then start server
export async function start() {
  try {
    if (!MONGODB_URI && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      MONGODB_URI = memoryServer.getUri();
    }
    if (!MONGODB_URI) {
      console.error('Missing MONGODB_URI and cannot start without it in this environment.');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI, { dbName: 'linksnap' });
    console.log('MongoDB connected');
    const server = app.listen(PORT, () => console.log(`LinkSnap API listening on ${PORT}`));
    console.log(`Base URL assumed as ${BASE_URL}`);
    return server;
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Only auto-start if not in test environment
if (process.env.NODE_ENV !== 'test') {
  start();
}

export { app };

// Support CommonJS require in Jest without ESM transform
// (Jest by default treats test env as CommonJS; this shim allows access.)
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined') {
  // eslint-disable-next-line no-undef
  module.exports = { app, start };
}
