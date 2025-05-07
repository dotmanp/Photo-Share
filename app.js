const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const userRoutes = require('./routes/user');
const cors = require('cors');



dotenv.config();

const app = express();
app.use(express.json());
const pool = require('./db');

app.use(cors());

console.log('Environment Variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
});
console.log('men mount!!!')
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/user', userRoutes);

app.get('/test-db', async (req, res) => {
   
    try {
      const [rows] = await pool.query('SELECT 1 + 1 AS result');
      res.json({ success: true, result: rows[0].result });
    } catch (err) {
      console.error('DB connection failed:', err);
      res.status(500).json({ success: false, error: 'Database connection failed' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
