const autoBind = require('auto-bind');

class CommentsHandler {
  constructor({ addCommentUseCase, deleteCommentUseCase }) {
    this._addCommentUseCase = addCommentUseCase;
    this._deleteCommentUseCase = deleteCommentUseCase;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;
    // console.log({ id, threadId, ...request.payload });
    // console.log(id);
    const addedComment = await this._addCommentUseCase
      .execute({ threadId, content, owner });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    // console.log(response);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await this._deleteCommentUseCase.execute({ threadId, commentId, owner });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    // console.log(response);
    return response;
  }
}

module.exports = CommentsHandler;
