import { Router } from 'express';
import Link from '../models/Link.js';

const router = Router();

// Simple API key auth via header x-api-key
router.use((req, res, next) => {
  const key = req.header('x-api-key');
  if (!process.env.ADMIN_API_KEY) return res.status(501).json({ error: 'Admin API not configured.' });
  if (!key || key !== process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

// Delete a link by code/alias
router.delete('/links/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Link.findOneAndDelete({ $or: [{ code: id }, { alias: id }] });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id });
  } catch (e) { next(e); }
});

// Basic stats summary
router.get('/stats', async (_req, res, next) => {
  try {
    const total = await Link.estimatedDocumentCount();
    const clicksAgg = await Link.aggregate([{ $group: { _id: null, clicks: { $sum: '$clicks' } } }]);
    const clicks = clicksAgg[0]?.clicks || 0;
    res.json({ totalLinks: total, totalClicks: clicks });
  } catch (e) { next(e); }
});

export default router;
