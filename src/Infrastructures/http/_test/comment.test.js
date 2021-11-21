// const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const injections = require('../../injections');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTableTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and added comment', async () => {
      const commentPayload = {
        content: 'ini content',
      };
      const accessToken = await ServerTableTestHelper.getAccessToken();
      const server = await createServer(injections);

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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        // url: '/threads/{threadId}/comments',
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(response);

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and deleted comment', async () => {
      const commentPayload = {
        content: 'ini content',
      };
      const accessToken = await ServerTableTestHelper.getAccessToken();
      const server = await createServer(injections);

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

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        // url: '/threads/{threadId}/comments',
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
