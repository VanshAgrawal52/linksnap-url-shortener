import { Router } from 'express';
import { nanoid } from 'nanoid';
import Link from '../models/Link.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Basic rate limiter: 30 shorten requests per 10 minutes per IP
const shortenLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Try again later.' }
});

// Helper function: validate URL using WHATWG URL parser
function isValidUrl(str) {
  try {
    const url = new URL(str);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (_) {
    return false;
  }
}

router.post('/', shortenLimiter, async (req, res, next) => {
  try {
  const { url, alias, expireIn } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url field.' });
    }
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }
    const normalized = url.trim();

    // If already shortened (belongs to our domain) we can just return it
    const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    if (normalized.startsWith(BASE_URL)) {
      return res.status(400).json({ error: 'URL already shortened.' });
    }

    // Check if existing identical originalUrl to avoid duplicates (optional optimization)
    let existing = await Link.findOne({ originalUrl: normalized, alias: { $exists: false } });
    if (existing) {
      return res.json({ code: existing.code, shortUrl: existing.shortUrl, originalUrl: existing.originalUrl });
    }

    // Validate alias (optional custom path segment)
    let finalCode;
    let finalAlias;
    if (alias) {
      if (typeof alias !== 'string' || !/^[a-zA-Z0-9_-]{3,30}$/.test(alias)) {
        return res.status(400).json({ error: 'Alias must be 3-30 chars: letters, numbers, _ or -.' });
      }
      const aliasExists = await Link.findOne({ $or: [{ alias: alias }, { code: alias }] });
      if (aliasExists) {
        return res.status(409).json({ error: 'Alias already in use.' });
      }
      finalCode = nanoid(5); // still generate internal code
      finalAlias = alias;
    } else {
      finalCode = nanoid(7); // 7 chars ~ 569B combinations (safe for small scale)
    }

    // Expiration
    let expiresAt;
    if (expireIn != null) {
      const minutes = Number(expireIn);
      if (Number.isNaN(minutes) || minutes <= 0 || minutes > 60 * 24 * 30) { // max 30 days
        return res.status(400).json({ error: 'expireIn must be minutes (1 - 43200).' });
      }
      expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    }

    const pathSegment = finalAlias || finalCode;
    const shortUrl = `${BASE_URL.replace(/\/$/, '')}/${pathSegment}`;
    const link = await Link.create({ code: finalCode, alias: finalAlias, originalUrl: normalized, shortUrl, expiresAt });
    return res.status(201).json({ code: link.code, alias: link.alias, shortUrl: link.shortUrl, originalUrl: link.originalUrl, expiresAt: link.expiresAt });
  } catch (err) {
    if (err.code === 11000) {
      // Rare collision – retry once
      try {
        const code = nanoid(8);
        const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const shortUrl = `${BASE_URL.replace(/\/$/, '')}/${code}`;
        const link = await Link.create({ code, originalUrl: req.body.url.trim(), shortUrl });
        return res.status(201).json({ code: link.code, shortUrl: link.shortUrl, originalUrl: link.originalUrl });
      } catch (e2) {
        return next(e2);
      }
    }
    next(err);
  }
});

// Alias availability check
router.get('/check/:alias', async (req, res) => {
  const { alias } = req.params;
  if (!alias || !/^[a-zA-Z0-9_-]{3,30}$/.test(alias)) {
    return res.status(400).json({ error: 'Invalid alias format.' });
  }
  const exists = await Link.exists({ $or: [{ alias }, { code: alias }] });
  return res.json({ alias, available: !exists });
});

export default router;
