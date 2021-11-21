const NewComment = require('../NewComment');

describe('a Comment entities', () => {
  it('should throw error when thread id did not available', () => {
    // Arrange
    const payload = {
      content: 'ini content',
      owner: 'ini owner',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_AVAILABLE_THREAD');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'ini content',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      content: 123,
      owner: {},
    };

    // Action and assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'ini content',
      owner: 'user-123',
    };

    // Action
    const { threadId, content, owner } = new NewComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
