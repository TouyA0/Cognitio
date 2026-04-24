import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { query, getClient } from '../services/db.js';

const router = Router();

// Middleware to verify authentication
router.use(verifyToken);

// Create a new discovery
router.post('/', async (req: Request, res: Response) => {
  try {
    const { type, title, content, tags = [] } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate required fields
    if (!type || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get a client from the pool for transaction
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Insert discovery
      const discoveryResult = await client.query(
        'INSERT INTO discoveries (user_id, type, title, content, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at',
        [userId, type, title, content, JSON.stringify(req.body.metadata || {})]
      );

      const discoveryId = discoveryResult.rows[0].id;

      // Add tags
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Find or create tag
          const tagResult = await client.query(
            'SELECT id FROM tags WHERE name = $1',
            [tagName]
          );

          let tagId;
          if (tagResult.rows.length > 0) {
            tagId = tagResult.rows[0].id;
          } else {
            // Create new tag
            const newTagResult = await client.query(
              'INSERT INTO tags (name) VALUES ($1) RETURNING id',
              [tagName]
            );
            tagId = newTagResult.rows[0].id;
          }

          // Add to discovery_tags
          await client.query(
            'INSERT INTO discovery_tags (discovery_id, tag_id, locked) VALUES ($1, $2, false) ON CONFLICT DO NOTHING',
            [discoveryId, tagId]
          );
        }
      }

      await client.query('COMMIT');

      return res.status(201).json({
        id: discoveryId,
        type,
        title,
        content,
        tags,
        created_at: discoveryResult.rows[0].created_at,
        updated_at: discoveryResult.rows[0].updated_at,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating discovery:', err);
    return res.status(500).json({ error: 'Failed to create discovery' });
  }
});

// Suggest tags using Claude Haiku
router.post('/suggest-tags', async (req: Request, res: Response) => {
  try {
    const { type, title, content, quote_text, author, context } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Build prompt based on discovery type
    let prompt = '';
    if (type === 'quote') {
      prompt = `Tu es un assistant théologique qui aide à catégoriser des citations.

Voici la citation que l'utilisateur vient d'ajouter :
Auteur : ${author}
Citation : ${quote_text}
Contexte : ${context}

Propose 4-7 tags pertinents qui s'appliquent à cette citation.
Pour chaque tag, explique en une phrase pourquoi c'est pertinent.

Réponds SEULEMENT en JSON (pas de markdown) :
{
  "tags": [
    {
      "name": "NomDuTag",
      "explanation": "Explication courte"
    }
  ]
}`;
    } else {
      prompt = `Tu es un assistant théologique qui aide à catégoriser des contenus.

Contenu:
Type: ${type}
Titre : ${title}
Contenu : ${content}

Propose 5-8 tags pertinents qui s'appliquent à ce contenu.
Pour chaque tag, explique en une phrase pourquoi c'est pertinent.

Réponds SEULEMENT en JSON (pas de markdown) :
{
  "tags": [
    {
      "name": "NomDuTag",
      "explanation": "Explication courte"
    }
  ]
}`;
    }

    // TODO: Call Claude Haiku API
    // For now, return empty suggestions
    return res.json({
      tags: [],
      message: 'Tag suggestion not yet implemented',
    });
  } catch (err) {
    console.error('Error suggesting tags:', err);
    return res.status(500).json({ error: 'Failed to suggest tags' });
  }
});

export default router;
