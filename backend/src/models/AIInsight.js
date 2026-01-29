import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
    index: true
  },
  insightType: {
    type: String,
    required: true
  },
  insightText: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  metadata: mongoose.Schema.Types.Mixed,
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
});

// Index for fast retrieval of latest insights per link
aiInsightSchema.index({ linkId: 1, generatedAt: -1 });

export default mongoose.model('AIInsight', aiInsightSchema);