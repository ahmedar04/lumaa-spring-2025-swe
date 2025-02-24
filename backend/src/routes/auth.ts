console.log('Auth router loaded');

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = express.Router();

router.use((req, res, next) => {
    console.log(`Auth Router received: ${req.method} ${req.originalUrl}`);
    next();
});

// Debug log to verify the route is hit
router.post('/register', async (req, res) => {
  console.log('POST /register route hit'); // <-- This log should appear when the route is accessed
  const { username, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error in /register', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Also define /login for completeness
router.post('/login', async (req, res) => {
  console.log('POST /login route hit');
  const { username, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Error in /login', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
