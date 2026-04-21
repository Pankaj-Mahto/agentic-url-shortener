import express from "express";
import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js";

const router = express.Router();

/**
 * GET /api/analytics/:id
 * Real analytics for a short link
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate link exists
    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // 2. Fetch analytics logs for this link
    const analytics = await Analytics.find({ linkId: id }).sort({
      timestamp: -1,
    });

    // 3. Unique visitors (based on IP)
    const uniqueIPs = new Set(
      analytics.map((entry) => entry.ip).filter(Boolean)
    );

    // 4. Device breakdown (optional enhancement)
    const deviceStats = analytics.reduce((acc, curr) => {
      const device = curr.device || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // 5. Response
    return res.json({
      linkId: id,
      totalClicks: analytics.length || link.clicks || 0,
      uniqueVisitors: uniqueIPs.size,
      deviceStats,
      recentClicks: analytics.slice(0, 10),
    });

  } catch (err) {
    console.error("Analytics route error:", err);
    return res.status(500).json({
      message: "Server error while fetching analytics",
    });
  }
});

export default router;