const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const Rating = require('../models/rating');

router.post('/:id/rate', authenticateToken, async (req, res) => {
    const mediaId = req.params.id;
    const userId = req.user.id;
    const { rating } = req.body;
  
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
  
    try {
      const result = await Rating.submitOrUpdate(userId, mediaId, rating);
      res.json({ message: `Rating ${result}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

// // @route   POST /api/media/:id/rate
// // @desc    Submit a rating (1–5) for a media item
// // @access  Protected
// router.post('/:id/rate', authenticateToken, async (req, res) => {
//   const mediaId = req.params.id;
//   const userId = req.user.id;
//   const { rating } = req.body;

//   if (!rating || rating < 1 || rating > 5) {
//     return res.status(400).json({ error: 'Rating must be between 1 and 5' });
//   }

//   try {
//     // Check if the user already rated this media
//     const [existing] = await pool.query(
//       'SELECT * FROM ratings WHERE user_id = ? AND media_id = ?',
//       [userId, mediaId]
//     );

//     if (existing.length > 0) {
//       // Update existing rating
//       await pool.query(
//         'UPDATE ratings SET rating = ? WHERE user_id = ? AND media_id = ?',
//         [rating, userId, mediaId]
//       );
//       return res.json({ message: 'Rating updated' });
//     } else {
//       // Insert new rating
//       await pool.query(
//         'INSERT INTO ratings (user_id, media_id, rating) VALUES (?, ?, ?)',
//         [userId, mediaId, rating]
//       );
//       return res.json({ message: 'Rating submitted' });
//     }
//   } catch (err) {
//     console.error('Rating error:', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

module.exports = router;