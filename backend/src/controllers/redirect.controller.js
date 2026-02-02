import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

export const redirectToOriginal = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const link = await Link.findOne({ shortCode, isActive: true });

    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found or inactive" });
    }

    // Increment clicks atomically
    await Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } });

    // Fire-and-forget analytics logging
    (async () => {
      try {
        const ip =
          req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown";
        const geo = geoip.lookup(ip) || { country: "Unknown", city: "Unknown" };

        const parser = new UAParser(req.headers["user-agent"] || "");
        const uaResult = parser.getResult();

        // Improve localhost display (optional)
        const displayIp =
          ip === "::1" || ip === "127.0.0.1" || ip.startsWith("::ffff:127.")
            ? "localhost"
            : ip;

        const displayCountry =
          geo.country ||
          (ip.startsWith("127.") || ip === "::1" ? "Local" : "Unknown");
        const displayCity = geo.city || "Local";

        await Analytics.create({
          linkId: link._id,
          timestamp: new Date(),
          ip: displayIp,
          userAgent: req.headers["user-agent"] || "unknown",
          referrer: req.headers.referer || null,
          country: displayCountry,
          city: displayCity,
          device: uaResult.device.type || "unknown",
          browser: uaResult.browser.name || "unknown",
          os: uaResult.os.name || "unknown",
        });

        await Analytics.create({
          linkId: link._id,
          timestamp: new Date(),
          ip,
          userAgent: req.headers["user-agent"] || "unknown",
          referrer: req.headers.referer || req.headers.referrer || null,
          country: geo.country || "Unknown",
          city: geo.city || "Unknown",
          device: uaResult.device.type || "unknown",
          browser: uaResult.browser.name || "unknown",
          os: uaResult.os.name || "unknown",
        });
      } catch (analyticsErr) {
        console.error(
          "Analytics logging failed (non-blocking):",
          analyticsErr.message,
        );
      }
    })();

    // Redirect immediately
    res.redirect(302, link.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during redirect" });
  }
};
