const db = require('../config/db');

async function getAllEvents() {
  const [rows] = await db.query(
    'SELECT id, task_id, event_type, payload, created_at FROM task_events ORDER BY created_at DESC'
  );

  return rows;
}

async function getEventsByTaskId(taskId) {
  const [rows] = await db.query(
    'SELECT id, task_id, event_type, payload, created_at FROM task_events WHERE task_id = ? ORDER BY created_at DESC',
    [taskId]
  );

  return rows;
}

async function getEventCountsByType() {
  const [rows] = await db.query(
    'SELECT event_type, COUNT(*) AS total FROM task_events GROUP BY event_type'
  );

  return rows;
}

module.exports = {
  getAllEvents,
  getEventsByTaskId,
  getEventCountsByType,
};