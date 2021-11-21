const DetailComment = require('../DetailComment');

describe('a Detail Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'ini content',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'test',
      username: 'username',
      date: 123,
      content: 123,
    };

    // Action and assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '20211011',
      content: 'ini content',
      is_delete: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
  });

  it('should create Detail Comment object correctly when is_delete value is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '20211011',
      content: 'ini content',
      isDelete: true,
    };

    // Action

    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });
});
