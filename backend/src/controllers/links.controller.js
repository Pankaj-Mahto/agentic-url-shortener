import Link from '../models/Link.js';
import { generateUniqueShortCode } from '../services/shortCode.service.js';
import { suggestAliases, categorizeUrl } from '../services/ai.service.js';

export const createLink = async (req, res) => {
  const { originalUrl, customAlias } = req.body;
  const userId = req.user._id;

  if (!originalUrl) {
    return res.status(400).json({ success: false, message: 'Original URL is required' });
  }

  // Basic URL validation
  try {
    new URL(originalUrl);
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid URL format' });
  }

  try {
    let shortCode;

    if (customAlias) {
      // Validate custom alias (your spec: 3-20 chars, alphanumeric + hyphens, lowercase)
      if (!/^[a-z0-9-]{3,20}$/.test(customAlias)) {
        return res.status(400).json({ success: false, message: 'Invalid custom alias format' });
      }
      const existing = await Link.findOne({ shortCode: customAlias.toLowerCase() });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Custom alias already taken' });
      }
      shortCode = customAlias.toLowerCase();
    } else {
      shortCode = await generateUniqueShortCode();
    }

    // Call AI features in parallel with fallbacks
    const [aliasesResult, catResult] = await Promise.allSettled([
      suggestAliases(originalUrl),
      categorizeUrl(originalUrl)
    ]);

    const aiSuggestedAliases = aliasesResult.status === 'fulfilled' ? aliasesResult.value : [];
    const { category = 'uncategorized', tags = [] } = catResult.status === 'fulfilled' ? catResult.value : {};

    const link = await Link.create({
      userId,
      originalUrl,
      shortCode,
      customAlias: customAlias ? customAlias.toLowerCase() : undefined,
      aiSuggestedAliases,
      category,
      tags,
    });

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    res.status(201).json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl,
        aiSuggestedAliases: link.aiSuggestedAliases,
        category: link.category,
        tags: link.tags,
        createdAt: link.createdAt
      }
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ success: false, message: 'Failed to create link' });
  }
};

export const getUserLinks = async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  try {
    const skip = (page - 1) * limit;

    const links = await Link.find({ userId })
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .select('originalUrl shortCode customAlias category tags clicks createdAt');

    const total = await Link.countDocuments({ userId });

    res.json({
      success: true,
      links,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch links' });
  }
};
export const getLinkById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const link = await Link.findOne({ _id: id, userId })
      .select('-__v');  // exclude version key if you want

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found or you do not own it' });
    }

    const shortUrl = `${process.env.BASE_URL}/${link.shortCode}`;

    res.json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl,
        customAlias: link.customAlias,
        aiSuggestedAliases: link.aiSuggestedAliases,
        category: link.category,
        tags: link.tags,
        clicks: link.clicks,
        isActive: link.isActive,
        expiresAt: link.expiresAt,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      }
    });
  } catch (error) {
    console.error('Get single link error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};