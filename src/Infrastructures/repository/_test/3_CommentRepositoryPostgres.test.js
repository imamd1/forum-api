const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of ComentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    });
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should add new comment and return added comment correctly', async () => {
        // Arrange

        const newComment = {
          threadId: 'thread-123',
          content: 'ini content',
          owner: 'user-123',
        };
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await commentRepositoryPostgres.addComment(newComment);

        const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
        expect(comments).toHaveLength(1);
      });
    });

    describe('deleteCommentById', () => {
      it('should throw error when comment does not exist', async () => {
        const threadId = 'thread-123';
        const owner = 'user-123';
        const commentId = 'comment-123';

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });

        await expect(commentRepositoryPostgres.deleteCommentById('comment-1'))
          .rejects.toThrowError(NotFoundError);
      });
      it('delete comment correctly', async () => {
        const threadId = 'thread-123';
        const owner = 'user-123';
        const commentId = 'comment-123';

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });

        await expect(commentRepositoryPostgres.deleteCommentById(commentId))
          .resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('verifyCommentOwner', () => {
      it('should throw error when comment does not exist', async () => {
        const threadId = 'thread-123';
        const owner = 'user-123';
        const commentId = 'comment-123';

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });

        await expect(commentRepositoryPostgres.verifyCommentOwner('comment-1', owner))
          .rejects.toThrow(NotFoundError);
      });

      it('should throw error when owner does not match', async () => {
        const threadId = 'thread-123';
        const owner = 'user-123';
        const commentId = 'comment-123';

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });

        await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-21'))
          .rejects
          .toThrowError(AuthorizationError);
      });

      it('should verify comment.s owner', async () => {
        const threadId = 'thread-123';
        const owner = 'user-123';
        const commentId = 'comment-123';

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });

        await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, owner))
          .resolves.not.toThrowError(AuthorizationError);
      });
    });

    describe('getDetailCommentByThreadId', () => {
      it('should return get detail comment by thread id ', async () => {
        const thId = 'thread-123';
        const commentId = 'comment-123';
        const uid = 'user-123';

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        await CommentsTableTestHelper.addComment({ id: commentId, threadId: thId, owner: uid });
        const comment = await commentRepositoryPostgres.getCommentByThreadId(thId);

        expect(comment).toHaveLength(1);
      });
    });
  });
});
