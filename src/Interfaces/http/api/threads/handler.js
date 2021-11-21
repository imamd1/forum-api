const autoBind = require('auto-bind');

class ThreadsHandler {
  constructor({ addThreadUseCase, getDetailThreadUseCase }) {
    this._addThreadUseCase = addThreadUseCase;
    this._getDetailThreadUseCase = getDetailThreadUseCase;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addedThread = await this._addThreadUseCase
      .execute({ ...request.payload, owner });
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const thread = await this._getDetailThreadUseCase
      .execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
