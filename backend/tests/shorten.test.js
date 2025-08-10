const request = require('supertest');
const { app, start } = require('../server.js');
const mongoose = require('mongoose');

// Use in-memory Mongo (simple: provide a test db suffix) - expects a running Mongo if MONGODB_URI provided.
// For a more isolated setup, you'd integrate mongodb-memory-server; omitted to stay lightweight.

beforeAll(async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('Skipping tests: MONGODB_URI not set');
    return;
  }
  await start();
});

describe('POST /api/shorten', () => {
  it('rejects invalid url', async () => {
    if (!process.env.MONGODB_URI) return; // skip
  const res = await request(app).post('/api/shorten').send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
  }
});
