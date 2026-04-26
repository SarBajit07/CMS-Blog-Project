const db = require('../config/db');

const getAll = async () => {
  const result = await db.query(`
    SELECT p.*, u.username AS author_name
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.status = 'published' AND p.deleted_at IS NULL
    ORDER BY p.published_at DESC
  `);
  return result.rows;
};

const getBySlug = async (slug) => {
  const result = await db.query(`
    SELECT p.*, u.username AS author_name
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.slug = $1
  `, [slug]);
  return result.rows[0];
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async ({ author_id, title, slug, excerpt, body, cover_image_url, status }) => {
  const published_at = status === 'published' ? new Date() : null;
  const result = await db.query(`
    INSERT INTO posts (author_id, title, slug, excerpt, body, cover_image_url, status, published_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [author_id, title, slug, excerpt, body, cover_image_url, status, published_at]);
  return result.rows[0];
};

const update = async (id, { title, slug, excerpt, body, cover_image_url, status }) => {
  const result = await db.query(`
    UPDATE posts
    SET title = $1, slug = $2, excerpt = $3, body = $4,
        cover_image_url = $5, status = $6,
        published_at = CASE WHEN $6 = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END,
        updated_at = NOW()
    WHERE id = $7
    RETURNING *
  `, [title, slug, excerpt, body, cover_image_url, status, id]);
  return result.rows[0];
};

const deleteById = async (id) => {
  const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const getByAuthor = async (author_id) => {
  const result = await db.query(`
    SELECT * FROM posts 
    WHERE author_id = $1 AND deleted_at IS NULL
    ORDER BY created_at DESC
  `, [author_id]);
  return result.rows;
};

module.exports = {
  getAll,
  getBySlug,
  getById,
  create,
  update,
  deleteById,
  getByAuthor,
};
