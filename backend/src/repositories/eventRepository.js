const db = require('../config/db');

async function getAllEvents(userId) {
  const [rows] = await db.query(
    `SELECT *
     FROM task_events
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
}

async function getEventsByTaskId(taskId, userId) {
  const [rows] = await db.query(
    `SELECT *
     FROM task_events
     WHERE task_id = ? AND user_id = ?
     ORDER BY created_at DESC`,
    [taskId, userId]
  );

  return rows;
}

async function getEventCountsByType(userId) {
  const [rows] = await db.query(
    `SELECT event_type, COUNT(*) AS total
     FROM task_events
     WHERE user_id = ?
     GROUP BY event_type`,
    [userId]
  );

  return rows;
}

module.exports = {
  getAllEvents,
  getEventsByTaskId,
  getEventCountsByType,
};