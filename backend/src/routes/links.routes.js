import express from 'express';
import { createLink, getUserLinks,getLinkById } from '../controllers/links.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createLink);
// Add other routes (GET /, GET /:id, etc.) later as needed
router.get('/', protect, getUserLinks);
router.get('/:id', protect, getLinkById);

export default router;