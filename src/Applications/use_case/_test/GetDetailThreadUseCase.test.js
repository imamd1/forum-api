const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating get detail thread action correctly', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const commentsData = [
      {
        id: commentId,
        username: 'imamd',
        date: '20211011',
        content: 'ini content',
        is_delete: false,
      },
      {
        id: 'comment-12345',
        username: 'imamd',
        date: '20211012',
        content: 'ini contentbaru',
        is_delete: true,
      },
    ];

    const expectedDetailThread = {
      id: threadId,
      title: 'ini title',
      body: 'ini body',
      date: '20211011',
      username: 'imamdan',
      comments: commentsData,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentsData));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const getDetailThread = await getDetailThreadUseCase.execute({ threadId });

    expect(getDetailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
  });
});
