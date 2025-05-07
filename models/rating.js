const pool = require('../db');

const Rating = {
  async submitOrUpdate(userId, mediaId, rating) {
    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND media_id = ?',
      [userId, mediaId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE ratings SET rating = ?, created_at = CURRENT_TIMESTAMP WHERE user_id = ? AND media_id = ?',
        [rating, userId, mediaId]
      );
      return 'updated';
    } else {
      await pool.query(
        'INSERT INTO ratings (user_id, media_id, rating) VALUES (?, ?, ?)',
        [userId, mediaId, rating]
      );
      return 'inserted';
    }
  },

  async getAverage(mediaId) {
    const [rows] = await pool.query(
      'SELECT ROUND(AVG(rating), 2) AS average_rating FROM ratings WHERE media_id = ?',
      [mediaId]
    );
    return rows[0]?.average_rating || null;
  },

  async getUserRating(userId, mediaId) {
    const [rows] = await pool.query(
      'SELECT rating FROM ratings WHERE user_id = ? AND media_id = ?',
      [userId, mediaId]
    );
    return rows[0]?.rating || null;
  },

  async getRatingCount(mediaId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM ratings WHERE media_id = ?',
      [mediaId]
    );
    return rows[0]?.count || 0;
  }
};

module.exports = Rating;
