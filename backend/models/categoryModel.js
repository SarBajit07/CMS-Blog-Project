const db = require('../config/db');

const getAll = async () => {
  const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
  return result.rows;
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0];
};

const getBySlug = async (slug) => {
  const result = await db.query('SELECT * FROM categories WHERE slug = $1', [slug]);
  return result.rows[0];
};

const create = async ({ name, slug, description }) => {
  const result = await db.query(`
    INSERT INTO categories (name, slug, description)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [name, slug, description]);
  return result.rows[0];
};

const update = async (id, { name, slug, description }) => {
  const result = await db.query(`
    UPDATE categories
    SET name = $1, slug = $2, description = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `, [name, slug, description, id]);
  return result.rows[0];
};

const deleteById = async (id) => {
  const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

module.exports = {
  getAll,
  getById,
  getBySlug,
  create,
  update,
  deleteById,
};
