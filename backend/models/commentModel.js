const pool = require('../config/db');

class CommentModel {
  static async create({ postId, authorId, parentId, body, isApproved = false }) {
    const query = `
      INSERT INTO comments (post_id, author_id, parent_id, body, is_approved)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [postId, authorId, parentId || null, body, isApproved]);
    return result.rows[0];
  }

  static async getByPostId(postId, onlyApproved = true) {
    let query = `
      SELECT c.*, u.username as author_name, u.avatar_url
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.post_id = $1
    `;
    if (onlyApproved) {
      query += ` AND c.is_approved = TRUE`;
    }
    query += ` ORDER BY c.created_at ASC`;
    const result = await pool.query(query, [postId]);
    return result.rows;
  }

  static async getAll() {
    const query = `
      SELECT c.*, p.title as post_title, u.username as author_name
      FROM comments c
      LEFT JOIN posts p ON c.post_id = p.id
      LEFT JOIN users u ON c.author_id = u.id
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async updateStatus(id, isApproved) {
    const query = `
      UPDATE comments
      SET is_approved = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [isApproved, id]);
    return result.rows[0];
  }

  static async deleteById(id) {
    const query = `DELETE FROM comments WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = CommentModel;
