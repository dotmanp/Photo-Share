const pool = require('../db');

async function addLike(userId, mediaId) {
  try {
    await pool.query('INSERT INTO likes (user_id, media_id) VALUES (?, ?)', [userId, mediaId]);
    return { liked: true };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return { liked: false, message: 'Already liked' };
    throw err;
  }
}

async function getLikeCount(mediaId) {
  const [[result]] = await pool.query('SELECT COUNT(*) AS count FROM likes WHERE media_id = ?', [mediaId]);
  return result.count;
}

module.exports = { addLike, getLikeCount };