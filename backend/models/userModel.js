const db = require('../config/db');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findByUsername = async (username) => {
  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query(
    'SELECT id, username, email, role, avatar_url, is_active, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const create = async ({ username, email, passwordHash }) => {
  const result = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at',
    [username, email, passwordHash]
  );
  return result.rows[0];
};

const getAll = async () => {
  const result = await db.query(
    'SELECT id, username, email, role, avatar_url, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

const updateRole = async (id, role) => {
  const result = await db.query(
    'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, email, role',
    [role, id]
  );
  return result.rows[0];
};

const updateProfile = async (id, { avatar_url }) => {
  const result = await db.query(
    'UPDATE users SET avatar_url = COALESCE($1, avatar_url), updated_at = NOW() WHERE id = $2 RETURNING id, username, email, role, avatar_url',
    [avatar_url, id]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  create,
  getAll,
  updateRole,
  updateProfile,
  deleteById,
};
