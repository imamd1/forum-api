const pool = require('../../database/postgres/pool');
const injections = require('../../injections');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'title',
        body: 'dummy body',
      };
      const server = await createServer(injections);
      const accessToken = await ServerTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
    });

    it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
      const requestPayload = {
        title: 'title',
      };
      const server = await createServer(injections);
      const accessToken = await ServerTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru, input tidak lengkap');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return detail thread correctly', async () => {
      const server = await createServer(injections);
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title',
          body: 'dummy body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(threadResponse);
      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'ini content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'ini content',
          isDelete: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data).toBeDefined();
      expect(responseJSON.data.thread).toBeDefined();
      expect(responseJSON.data.thread.comments).not.toHaveLength(0);
    });
  });
});
