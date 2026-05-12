const db = require('../config/db');

async function getAllTasks(userId) {
  const [rows] = await db.query(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );

  return rows;
}

async function getTaskById(id, userId) {
  const [rows] = await db.query(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  return rows[0];
}

async function createTask({ userId, title, description, status }) {
  const [result] = await db.query(
    'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
    [userId, title, description, status]
  );

  return {
    id: result.insertId,
    user_id: userId,
    title,
    description,
    status,
  };
}

async function updateTask(id, userId, { title, description, status }) {
  const [result] = await db.query(
    `UPDATE tasks
     SET title = ?, description = ?, status = ?
     WHERE id = ? AND user_id = ?`,
    [title, description, status, id, userId]
  );

  return result.affectedRows;
}

async function deleteTask(id, userId) {
  const [result] = await db.query(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  return result.affectedRows;
}

async function getTaskCountsByStatus(userId) {
  const [rows] = await db.query(
    `SELECT status, COUNT(*) AS total
     FROM tasks
     WHERE user_id = ?
     GROUP BY status`,
    [userId]
  );

  return rows;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskCountsByStatus,
};