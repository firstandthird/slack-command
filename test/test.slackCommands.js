'use strict';
const tap = require('tap');
const Rapptor = require('rapptor');

let slackCommand;
tap.beforeEach(async() => {
  slackCommand = new Rapptor({});
  await slackCommand.start();
});

tap.afterEach(async() => {
  await slackCommand.stop();
});

tap.test('accepts and processes command registered as a function', async(t) => {
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
