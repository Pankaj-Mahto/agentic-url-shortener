import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  customAlias: {
    type: String,
    sparse: true,
    lowercase: true
  },
  aiSuggestedAliases: [{
    type: String
  }],
  category: {
    type: String,
    default: 'uncategorized'
  },
  tags: [{
    type: String
  }],
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  }
}, { timestamps: true });

// Index for fast lookup by shortCode
linkSchema.index({ shortCode: 1 });

export default mongoose.model('Link', linkSchema);