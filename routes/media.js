const express = require('express');
const multer = require('multer');
const uploadToAzure = require('../utils/azureBlob');
const { authenticateToken, isCreator, isConsumer } = require('../middleware/auth');
const { addLike, getLikeCount } = require('../models/like');
const pool = require('../db');

const router = express.Router();
const upload = multer();

console.log("I got here too!");
// POST /api/media/upload (creator only)
router.post('/upload', authenticateToken, isCreator, upload.single('image'), async (req, res) => {
  const { title, caption, location, people } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Image required' });

  try {
    const url = await uploadToAzure(file.buffer, file.originalname, file.mimetype);
    console.log("I got here!")
    await pool.query(
      `INSERT INTO media (creator_id, title, caption, location, people, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, caption, location, JSON.stringify(people?.split(',')), url]
    );
    res.status(201).json({ message: 'Upload successful', image_url: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/media (all media)
router.get('/', authenticateToken, async (req, res) => {
  console.log("I got here too!");
  const [rows] = await pool.query('SELECT * FROM media ORDER BY uploaded_at DESC');
  res.json(rows);
});

// GET /api/media/:id (single item with comments & avg rating)
router.get('/:id', authenticateToken, async (req, res) => {
  const mediaId = req.params.id;

  try {
    const [[media]] = await pool.query('SELECT * FROM media WHERE id = ?', [mediaId]);
    const [comments] = await pool.query(
      'SELECT c.comment, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.media_id = ?',
      [mediaId]
    );
    const [[rating]] = await pool.query(
      'SELECT AVG(rating) as avg_rating FROM ratings WHERE media_id = ?',
      [mediaId]
    );
    res.json({ media, comments, avg_rating: rating.avg_rating });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load media details' });
  }
});

// POST /api/media/:id/comments (add comment)
router.post('/:id/comments', authenticateToken, isConsumer, async (req, res) => {
  const { comment } = req.body;
  const mediaId = req.params.id;
  await pool.query('INSERT INTO comments (user_id, media_id, comment) VALUES (?, ?, ?)', [
    req.user.id,
    mediaId,
    comment,
  ]);
  res.json({ message: 'Comment added' });
});

// POST /api/media/:id/rate (add rating)
router.post('/:id/rate', authenticateToken, isConsumer, async (req, res) => {
  const { rating } = req.body;
  const mediaId = req.params.id;
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1–5' });

  await pool.query('INSERT INTO ratings (user_id, media_id, rating) VALUES (?, ?, ?)', [
    req.user.id,
    mediaId,
    rating,
  ]);
  res.json({ message: 'Rating submitted' });
});



// POST /api/media/:id/like
router.post('/:id/like', authenticateToken, isConsumer, async (req, res) => {
  try {
    const mediaId = req.params.id;
    const { liked, message } = await addLike(req.user.id, mediaId);
    const count = await getLikeCount(mediaId);
    res.json({ liked, message: message || 'Liked successfully', totalLikes: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to like media' });
  }
});

module.exports = router;
