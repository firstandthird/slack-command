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

tap.test('accepts and processes command registered as a function', async(t) => {
  slackCommand.registerSlackCommand('/test', (slackPayload) => {
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
