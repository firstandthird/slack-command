'use strict';
const tap = require('tap');
const SlackCommand = require('../index.js');

let slackCommand;
tap.beforeEach(async() => {
  slackCommand = new SlackCommand(8080, {
    token: 'a token'
  });
  await slackCommand.start();
});

tap.afterEach(async() => {
  await slackCommand.stop();
});

tap.test('rejects if token does not match', async (t) => {
  const response = await slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'is wrong'
    }
  });
  t.equal(response.statusCode, 401, '401 unauthorized status code when token rejected');
  await slackCommand.stop();
  t.end();
});

tap.test('notifies if there is no matching command', async(t) => {
  const response = await slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/and_conquer'
    }
  });
  t.equal(response.statusCode, 405, '405 when command is missing ');
  await slackCommand.stop();
  t.end();
});

tap.test('accepts and processes command registered as a function', async(t) => {
  slackCommand.server.registerSlackCommand('/test', (slackPayload) => {
    return 'hello';
  });
  const response = await slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/test'
    }
  });
  t.equal(response.statusCode, 200, '200 when token accepted ');
  t.equal(response.result, 'hello', 'gets info back');
  await slackCommand.stop();
  t.end();
});

tap.test('accepts and matches text for a command registered as an object', async(t) => {
  slackCommand.server.registerSlackCommand('/test', {
    groups: (slackPayload, match) => {
      return 'hello';
    },
    'group (.*)': function(slackPayload, match) {
      //triggered if I do /pt group test.
      return 'goodbye';
    },
  });
  const response = await slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/test',
      text: 'groups'
    }
  });
  t.equal(response.statusCode, 200, '200 when token accepted ');
  t.equal(response.result, 'hello', 'gets info back');
  const response2 = await slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/test',
      text: 'group test'
    }
  });
  t.equal(response2.statusCode, 200, '200 when token accepted ');
  t.equal(response2.result, 'goodbye', 'gets info back');
  await slackCommand.stop();
  t.end();
});

tap.test('calls fallback if nothing matched the text', async(t) => {
  slackCommand.server.registerSlackCommand('/test', {
    '*': function(slackPayload) {
      return 'hello';
    },
  });
  const response = await slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/test',
      text: 'groups'
    }
  });
  t.equal(response.statusCode, 200, '200 when token accepted ');
  t.equal(response.result, 'hello', 'gets info back');
  await slackCommand.stop();
  t.end();
});
