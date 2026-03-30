import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Keep required for new links
  },

  originalUrl: {
    type: String,
    required: true,
    trim: true
  },

  shortCode: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  customAlias: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },

  aiSuggestedAliases: [{
    type: String,
    lowercase: true
  }],

  category: {
    type: String,
    default: 'uncategorized',
    lowercase: true
  },

  tags: [{
    type: String,
    lowercase: true
  }],

  clicks: {
    type: Number,
    default: 0
  },

  lastClicked: {
    type: Date
  },

  isActive: {
    type: Boolean,
    default: true
  },

  expiresAt: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Fix duplicate index warning
linkSchema.index({ shortCode: 1 }, { unique: true });
linkSchema.index({ user: 1, shortCode: 1 });

export default mongoose.model('Link', linkSchema);