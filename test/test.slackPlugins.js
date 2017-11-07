'use strict';
const tap = require('tap');
const plugin = require('../plugin.js')
const Hapi = require('hapi');
const async = require('async');

tap.test('plugin registers and processes commands', (t) => {
  async.autoInject({
    server(done) {
      const server = new Hapi.Server();
      server.connection({ port: 8080 });
      done(null, server);
    },
    register(server, done) {
      server.register({
        register: plugin,
        options: {}
      }, done);
    },
    start(server, done) {
      server.start(done);
    },
    command(start, server, done) {
      server.registerSlackCommand('/test', {
        groups(slackPayload, match, groupsDone) {
          groupsDone(null, 'hello');
        },
        'group (.*)'(slackPayload, match, groupDone) {
          //triggered if I do /pt group test.
          groupDone(null, 'goodbye');
        },
      });
    },
    query1(server, done) {
      server.inject({
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
        done();
      });
    },
    query2(server, done) {
      server.inject({
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
        done();
      });
    },
    cleanup(query1, query2, server, done) {
      server.stop(done);
      process.exit();
    }
  }, (err, result) => {
    t.equal(err, null);
    t.end();
  });
});
