const db = require('../config/db');

const getAll = async () => {
  const result = await db.query('SELECT * FROM tags ORDER BY name ASC');
  return result.rows;
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM tags WHERE id = $1', [id]);
  return result.rows[0];
};

const getBySlug = async (slug) => {
  const result = await db.query('SELECT * FROM tags WHERE slug = $1', [slug]);
  return result.rows[0];
};

const create = async ({ name, slug }) => {
  const result = await db.query(`
    INSERT INTO tags (name, slug)
    VALUES ($1, $2)
    RETURNING *
  `, [name, slug]);
  return result.rows[0];
};

const update = async (id, { name, slug }) => {
  const result = await db.query(`
    UPDATE tags
    SET name = $1, slug = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `, [name, slug, id]);
  return result.rows[0];
};

const deleteById = async (id) => {
  const result = await db.query('DELETE FROM tags WHERE id = $1 RETURNING id', [id]);
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
