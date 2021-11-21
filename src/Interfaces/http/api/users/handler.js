const autoBind = require('auto-bind');

class UsersHandler {
  constructor({ addUserUseCase }) {
    this._addUserUseCase = addUserUseCase;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const addedUser = await this._addUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
