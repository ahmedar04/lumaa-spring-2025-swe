import express from 'express';
import { pool } from '../db';

const router = express.Router();

// GET /tasks – Retrieve tasks for the authenticated user
router.get('/', async (req: any, res) => {
  const userId = req.user.id;
  try {
    const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    res.json(tasks.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST /tasks – Create a new task
router.post('/', async (req: any, res) => {
  const userId = req.user.id;
  const { title, description } = req.body;
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, is_complete, user_id) VALUES ($1, $2, false, $3) RETURNING *',
      [title, description, userId]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT /tasks/:id – Update an existing task
router.put('/:id', async (req: any, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { title, description, is_complete } = req.body;
  try {
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    if (taskResult.rows.length === 0) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, is_complete = $3 WHERE id = $4 RETURNING *',
      [title, description, is_complete, taskId]
    );
    res.json(updatedTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE /tasks/:id – Delete a task
router.delete('/:id', async (req: any, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  try {
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    if (taskResult.rows.length === 0) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
