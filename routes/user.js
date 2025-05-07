const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../db');
const router = express.Router();

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role FROM users WHERE id = ?', [
      req.user.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch user' });
  }
});

module.exports = router;
