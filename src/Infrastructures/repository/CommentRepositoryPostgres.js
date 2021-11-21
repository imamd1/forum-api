const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const dates = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, dates, owner, isDelete],
    };

    const result = await this._pool.query(query);
    // console.log(result);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(commentId) {
    const isDelete = true;

    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 returning id',
      values: [isDelete, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus komentar. id tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments where id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda bukan pemilik komentar');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text:
      `SELECT comments.*, users.username AS username FROM comments
      JOIN users ON comments.owner = users.id WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => (
      new DetailComment({
        ...row,
        isDelete: row.is_delete,
      })
    ));
  }
}

module.exports = CommentRepositoryPostgres;
