'use strict';
const tap = require('tap');
const Rapptor = require('rapptor');

tap.test('accepts and processes command registered as a function', async(t) => {
  const slackCommand = new Rapptor({});
  await slackCommand.start();
  slackCommand.server.registerSlackCommand('check', slackPayload => 'hello');
  const response = await slackCommand.server.inject({
    method: 'POST',
    url: '/api/command',
    payload: {
      token: 'token',
      command: '/test',
      text: 'check'
    }
  });
  t.equal(response.statusCode, 200, '200 when token accepted ');
  t.equal(response.result, 'hello', 'gets info back');
  await slackCommand.stop();
  t.end();
});

tap.test('accepts and processes command registered as a function', async(t) => {
  const slackCommand = new Rapptor({ env: 'test' });
  await slackCommand.start();
  // 'check' command will be registered by the ./commander.js plugin:
  const response = await slackCommand.server.inject({
    method: 'POST',
    url: '/api/command',
    payload: {
      token: 'token',
      command: '/test',
      text: 'check'
    }
  });
  t.equal(response.statusCode, 200, '200 when token accepted ');
  t.equal(response.result, 'hello', 'gets info back');
  await slackCommand.stop();
  t.end();
});
