const db = require('../config/db');

async function createUser({ name, email, passwordHash }) {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  return {
    id: result.insertId,
    name,
    email,
  };
}

async function findUserByEmail(email) {
  const [rows] = await db.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = ?',
    [email]
  );

  return rows[0];
}

async function findUserById(id) {
  const [rows] = await db.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );

  return rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};