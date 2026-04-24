import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { query } from '../services/db.js';

const router = Router();

// Middleware to verify authentication
router.use(verifyToken);

// Get all tags (for dropdown/selection)
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, parent_id, category FROM tags ORDER BY category, name'
    );

    const tags = result.rows;

    // Build hierarchical structure
    const tagsByCategory = tags.reduce((acc: any, tag: any) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tag);
      return acc;
    }, {});

    return res.json({
      tags: tags,
      byCategory: tagsByCategory,
    });
  } catch (err) {
    console.error('Error fetching tags:', err);
    return res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Search tags by name
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const result = await query(
      'SELECT id, name, category FROM tags WHERE name ILIKE $1 ORDER BY name LIMIT 20',
      [`%${q}%`]
    );

    return res.json({ tags: result.rows });
  } catch (err) {
    console.error('Error searching tags:', err);
    return res.status(500).json({ error: 'Failed to search tags' });
  }
});

export default router;
