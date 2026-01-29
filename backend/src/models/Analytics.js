import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String,
  referrer: String,
  country: String,
  city: String,
  device: String,
  browser: String,
  os: String
});

export default mongoose.model('Analytics', analyticsSchema);