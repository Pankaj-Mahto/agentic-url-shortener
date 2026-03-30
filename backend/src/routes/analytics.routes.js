import express from 'express';
const router = express.Router();

import Link from '../models/Link.js';
import { protect } from '../middleware/auth.middleware.js';   // ← Change this path if your middleware has different name

// GET /api/links/analytics/:id
router.get('/:id', protect, async (req, res) => {
  try {
    console.log("Analytics requested for link ID:", req.params.id);
    console.log("Logged in user ID:", req.user?._id);

    if (!req.user?._id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // FIXED: More flexible query - find link even if user field is missing
    const link = await Link.findOne({
      _id: req.params.id,
      // Only check user if it exists in the document
      $or: [
        { user: req.user._id },           // Normal case
        { user: { $exists: false } },     // Old links where user was not saved
        { user: null }                    // In case user is null
      ]
    });

    if (!link) {
      return res.status(404).json({ 
        message: "Link not found" 
      });
    }

    // Success - return analytics
    const analytics = {
      _id: link._id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      totalClicks: link.clicks || 0,
      uniqueVisitors: 0,                    // TODO: Improve later with click history
      createdAt: link.createdAt,
      lastClicked: link.lastClicked || null,
      isActive: link.isActive
    };

    console.log("Analytics sent successfully for link:", link.shortCode);

    res.json(analytics);

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ 
      message: "Server error while fetching analytics" 
    });
  }
});

export default router;