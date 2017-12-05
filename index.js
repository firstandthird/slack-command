'use strict';
const Hapi = require('hapi');
const hapiSlackCommand = require('hapi-slack-command');


class SlackCommand {
  constructor(port, options) {
    this.options = options;
    this.server = new Hapi.Server({ port });
  }

  async stop() {
    await this.server.stop();
  }

  async start() {
    await this.server.register({
      plugin: hapiSlackCommand,
      options: this.options
    });
    await this.server.start();
  }
}

module.exports = SlackCommand;
