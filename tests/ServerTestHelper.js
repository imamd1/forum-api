/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');
// const pool = require('../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    await UsersTableTestHelper.addUser(payloadUser);
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
  },

  async getThreadParams(request) {
    const payloadUser = {
      id: 'user-1234',
      username: 'userA',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    await UsersTableTestHelper.addUser(payloadUser);
    await Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
    // await Jwt.token.decode(accessToken, )
    // const { id: userId } = request.auth.credentials;
    // console.log(userId);
    const day = new Date().toISOString();
    const payloadThread = {
      id: 'thread-123',
      title: 'ini title',
      body: 'ini body',
      date: day,
      owner: 'user-1234',
    };
    return ThreadsTableTestHelper.addThread(payloadThread);
  },
};

module.exports = ServerTestHelper;
