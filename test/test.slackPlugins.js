'use strict';
const tap = require('tap');
const plugin = require('../plugin.js')
const Hapi = require('hapi');
const async = require('async');

tap.test('plugin works', (t) => {
  async.autoInject({
    server(done) {
      const server = new Hapi.Server();
      server.connection({ port: 8080 });
    },
    register(server, done) {
      server.register({
        register: plugin,
        options: {}
      });
    },
    start(server, done) {
      server.start(done);
    },
    query(done) {

    }
  }, (err) => {
    t.equal(err, null);
    t.end();
  });
  // slackCommand.server.inject({
  //   method: 'POST',
  //   url: '/',
  //   payload: {
  //     token: 'is wrong'
  //   }
  // }, (response) => {
  //   t.equal(response.statusCode, 401, '401 unauthorized status code when token rejected');
  //   slackCommand.stop(t.end);
  // });
});
