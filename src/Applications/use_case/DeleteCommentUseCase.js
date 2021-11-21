// const NewComment = require('../../Domains/comments/entities/NewComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.findThreadById(threadId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
