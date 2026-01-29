import Link from '../models/Link.js';

export const redirectToOriginal = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const link = await Link.findOne({ shortCode, isActive: true });

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found or inactive' });
    }

    // For now just increment clicks (analytics will come later)
    link.clicks += 1;
    await link.save();

    // Redirect with 302 status
    res.redirect(302, link.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ success: false, message: 'Server error during redirect' });
  }
};