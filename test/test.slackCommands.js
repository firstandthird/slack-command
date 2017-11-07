'use strict';
const tap = require('tap');
const SlackCommand = require('../index.js').SlackCommand;

let slackCommand;
tap.beforeEach((done) => {
  slackCommand = new SlackCommand('a token');
  slackCommand.listen(8080, done);
});

tap.afterEach((done) => {
  slackCommand.stop(done);
});

tap.test('rejects if token does not match', (t) => {
  slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'is wrong'
    }
  }, (response) => {
    t.equal(response.statusCode, 401, '401 unauthorized status code when token rejected');
    slackCommand.stop(t.end);
  });
});

tap.test('notifies if there is no matching command', (t) => {
  slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/and_conquer'
    }
  }, (response) => {
    t.equal(response.statusCode, 405, '405 when command is missing ');
    slackCommand.stop(t.end);
  });
});

tap.test('can register handlers ', (t) => {
  slackCommand.register('/test', (slackPayload, done) => {});
  t.equal(typeof slackCommand.commands['/test'], 'function', 'registers the handler when specified as a function');
  slackCommand.register('/test', { '*': (slackPayload, done) => {} });
  t.equal(typeof slackCommand.commands['/test']['*'], 'function', 'registers the handler when specified as an object');
  slackCommand.stop(t.end);
});

tap.test('accepts and processes command registered as a function', (t) => {
  slackCommand.register('/test', (slackPayload, done) => {
    done(null, 'hello');
  });
  slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/test'
    }
  }, (response) => {
    t.equal(response.statusCode, 200, '200 when token accepted ');
    t.equal(response.result, 'hello', 'gets info back');
    slackCommand.stop(t.end);
  });
});

tap.test('accepts and matches text for a command registered as an object', (t) => {
  slackCommand.register('/test', {
    groups: (slackPayload, match, done) => {
      done(null, 'hello');
    },
    'group (.*)': function(slackPayload, match, done) {
      //triggered if I do /pt group test.
      done(null, 'goodbye');
    },
  });
  slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/test',
      text: 'groups'
    }
  }, (response) => {
    t.equal(response.statusCode, 200, '200 when token accepted ');
    t.equal(response.result, 'hello', 'gets info back');
    slackCommand.server.inject({
      method: 'POST',
      url: '/',
      payload: {
        token: 'a token',
        command: '/test',
        text: 'group test'
      }
    }, (response2) => {
      t.equal(response2.statusCode, 200, '200 when token accepted ');
      t.equal(response2.result, 'goodbye', 'gets info back');
      slackCommand.stop(t.end);
    });
  });
});

tap.test('calls fallback if nothing matched the text', (t) => {
  slackCommand.register('/test', {
    '*': function(slackPayload, done) {
      done(null, 'hello');
    },
  });
  slackCommand.server.inject({
    method: 'POST',
    url: '/',
    payload: {
      token: 'a token',
      command: '/test',
      text: 'groups'
    }
  }, (response) => {
    t.equal(response.statusCode, 200, '200 when token accepted ');
    t.equal(response.result, 'hello', 'gets info back');
    slackCommand.stop(t.end);
  });
});
