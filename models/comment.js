const pool = require('../db');

async function getCommentsByMedia(mediaId) {
  const [rows] = await pool.query(
    'SELECT c.comment, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE media_id = ?',
    [mediaId]
  );
  return rows;
}

async function addComment(userId, mediaId, comment) {
  await pool.query('INSERT INTO comments (user_id, media_id, comment) VALUES (?, ?, ?)', [
    userId, mediaId, comment
  ]);
}

module.exports = { getCommentsByMedia, addComment };