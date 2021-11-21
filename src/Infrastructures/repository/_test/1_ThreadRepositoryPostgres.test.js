const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewUser = require('../../../Domains/users/entities/NewUser');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedUser = require('../../../Domains/users/entities/AddedUser');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryProgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
    });
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should throw NotFoundError when thread does not available / does not exist', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await expect(threadRepositoryPostgres.findThreadById('thread-123')).rejects.toThrow(NotFoundError);
      });
      it('should add new thread and return added thread correctly', async () => {
        // Arrange

        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        // const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
        const payload = {
          title: 'ini title',
          body: 'ini body',
          owner: 'user-123',
        };

        const expectedAddThread = {
          id: 'thread-123',
          title: payload.title,
          owner: payload.owner,
        };

        expect(await threadRepositoryPostgres.addThread(payload)).toStrictEqual(expectedAddThread);
      });
    });

    describe('getThreadById Function', () => {
      it('should throw errror when thread not available', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await expect(threadRepositoryPostgres.getThreadById('thread-12'))
          .rejects
          .toThrow(NotFoundError);
      });
      it('should get detail thread correctly', async () => {
        const threadId = 'thread-123';
        // const owner = 'user-123';

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await ThreadsTableTestHelper.addThread({ id: threadId });

        await threadRepositoryPostgres.getThreadById(threadId);

        await expect(threadRepositoryPostgres.getThreadById(threadId))
          .resolves.not.toThrow(NotFoundError);
      });
    });
  });
});
