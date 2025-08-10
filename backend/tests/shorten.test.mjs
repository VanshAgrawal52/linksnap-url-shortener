import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../server.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGODB_URI = uri; // server uses this when connecting
  // Manually connect because server auto-starts only outside test; mimic start logic
  await mongoose.connect(uri, { dbName: 'linksnap' });
});

describe('Shorten & alias workflow', () => {
  it('rejects invalid url', async () => {
    const res = await request(app).post('/api/shorten').send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('creates a short link', async () => {
    const res = await request(app).post('/api/shorten').send({ url: 'https://example.com/path' });
    expect(res.status).toBe(201);
    expect(res.body.shortUrl).toMatch(/http:\/\/localhost:/);
    expect(res.body.code).toBeDefined();
  });

  it('checks alias availability endpoint', async () => {
    // Before creation should be available
    const avail1 = await request(app).get('/api/shorten/check/custom123');
    expect(avail1.status).toBe(200);
    expect(avail1.body.available).toBe(true);
    // Create with alias
    const created = await request(app).post('/api/shorten').send({ url: 'https://alias-test.com', alias: 'custom123' });
    expect(created.status).toBe(201);
    expect(created.body.alias).toBe('custom123');
    // After creation should be unavailable
    const avail2 = await request(app).get('/api/shorten/check/custom123');
    expect(avail2.status).toBe(200);
    expect(avail2.body.available).toBe(false);
  });

  it('prevents duplicate alias', async () => {
    const first = await request(app).post('/api/shorten').send({ url: 'https://dup-alias.com', alias: 'dupAlias' });
    expect(first.status).toBe(201);
    const second = await request(app).post('/api/shorten').send({ url: 'https://dup-alias-2.com', alias: 'dupAlias' });
    expect(second.status).toBe(409);
  });

  it('redirects using code', async () => {
    const created = await request(app).post('/api/shorten').send({ url: 'https://redirect-me.com/path' });
    expect(created.status).toBe(201);
    const { code, originalUrl } = created.body;
    const redirect = await request(app).get(`/${code}`).redirects(0);
    expect(redirect.status).toBe(302);
    expect(redirect.headers.location).toBe(originalUrl);
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState) await mongoose.connection.close();
  if (mongo) await mongo.stop();
});
