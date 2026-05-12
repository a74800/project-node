const db = require('../config/db');

async function getAllTasks() {
  const [rows] = await db.query('SELECT * FROM tasks');
  return rows;
}

async function getTaskById(id) {
  const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0];
}

async function createTask(task) {
  const { title, description, status } = task;

  const [result] = await db.query(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title, description, status]
  );

  return {
    id: result.insertId,
    title,
    description,
    status,
  };
}

async function updateTask(id, task) {
  const { title, description, status } = task;

  const [result] = await db.query(
    'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
    [title, description, status, id]
  );

  return result;
}

async function deleteTask(id) {
  const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
  return result;
}

async function getTaskCountsByStatus() {
  const [rows] = await db.query(
    'SELECT status, COUNT(*) AS total FROM tasks GROUP BY status'
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