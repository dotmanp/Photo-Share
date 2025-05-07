const pool = require('../db');

async function getAllMedia() {
  const [rows] = await pool.query('SELECT * FROM media ORDER BY uploaded_at DESC');
  return rows;
}

async function getMediaById(id) {
  const [[media]] = await pool.query('SELECT * FROM media WHERE id = ?', [id]);
  return media;
}

module.exports = { getAllMedia, getMediaById };