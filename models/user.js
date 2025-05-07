const pool = require('../db');

async function getUserById(id) {
  const [rows] = await pool.query('SELECT id, username, role FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { getUserById };