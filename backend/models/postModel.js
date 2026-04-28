const db = require('../config/db');

const getAll = async () => {
  const result = await db.query(`
    SELECT 
      p.*, 
      u.username AS author_name,
      COALESCE(
        (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) 
         FROM post_categories pc JOIN categories c ON pc.category_id = c.id WHERE pc.post_id = p.id), 
      '[]') AS categories,
      COALESCE(
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) 
         FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id), 
      '[]') AS tags
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.status = 'published' AND p.deleted_at IS NULL
    ORDER BY p.published_at DESC
  `);
  return result.rows;
};

const getBySlug = async (slug) => {
  const result = await db.query(`
    SELECT 
      p.*, 
      u.username AS author_name,
      COALESCE(
        (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) 
         FROM post_categories pc JOIN categories c ON pc.category_id = c.id WHERE pc.post_id = p.id), 
      '[]') AS categories,
      COALESCE(
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) 
         FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id), 
      '[]') AS tags
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.slug = $1
  `, [slug]);
  return result.rows[0];
};

const getById = async (id) => {
  const result = await db.query(`
    SELECT 
      p.*,
      COALESCE(
        (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) 
         FROM post_categories pc JOIN categories c ON pc.category_id = c.id WHERE pc.post_id = p.id), 
      '[]') AS categories,
      COALESCE(
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) 
         FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id), 
      '[]') AS tags
    FROM posts p 
    WHERE p.id = $1
  `, [id]);
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
    SELECT 
      p.*,
      COALESCE(
        (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) 
         FROM post_categories pc JOIN categories c ON pc.category_id = c.id WHERE pc.post_id = p.id), 
      '[]') AS categories,
      COALESCE(
        (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) 
         FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id), 
      '[]') AS tags
    FROM posts p 
    WHERE p.author_id = $1 AND p.deleted_at IS NULL
    ORDER BY p.created_at DESC
  `, [author_id]);
  return result.rows;
};

const setCategories = async (postId, categoryIds) => {
  await db.query('DELETE FROM post_categories WHERE post_id = $1', [postId]);
  if (categoryIds && categoryIds.length > 0) {
    const values = categoryIds.map(id => `(${postId}, ${id})`).join(', ');
    await db.query(`INSERT INTO post_categories (post_id, category_id) VALUES ${values}`);
  }
};

const setTags = async (postId, tagIds) => {
  await db.query('DELETE FROM post_tags WHERE post_id = $1', [postId]);
  if (tagIds && tagIds.length > 0) {
    const values = tagIds.map(id => `(${postId}, ${id})`).join(', ');
    await db.query(`INSERT INTO post_tags (post_id, tag_id) VALUES ${values}`);
  }
};

module.exports = {
  getAll,
  getBySlug,
  getById,
  create,
  update,
  deleteById,
  getByAuthor,
  setCategories,
  setTags,
};
