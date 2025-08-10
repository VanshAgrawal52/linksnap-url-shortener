import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
  alias: { type: String, unique: true, sparse: true },
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    clicks: { type: Number, default: 0 },
  expiresAt: { type: Date }
  },
  { timestamps: true }
);

// TTL index if expiresAt is set
linkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Link', linkSchema);
