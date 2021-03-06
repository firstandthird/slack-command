'use strict';
const tap = require('tap');
const Rapptor = require('rapptor');

tap.test('accepts and processes command registered as a function', async(t) => {
  const slackCommand = new Rapptor({
    context: {
      LIBDIR: process.cwd()
    }
  });
  await slackCommand.start();
  slackCommand.server.slackCommand.register('check', slackPayload => 'hello');
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

tap.test('accepts and processes command registered from folder', async(t) => {
  const slackCommand = new Rapptor({
    env: 'test',
    context: {
      LIBDIR: process.cwd()
    }
  });
  await slackCommand.start();
  // 'check' command will be registered by the hapi-slack-command plugin:
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
