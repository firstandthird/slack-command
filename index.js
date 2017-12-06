'use strict';
const Hapi = require('hapi');
const hapiSlackCommand = require('hapi-slack-command');
const hapiLogr = require('hapi-logr');

class SlackCommand {
  constructor(port, options) {
    this.options = options;
    this.server = new Hapi.Server({ port });
  }

  async stop() {
    await this.server.stop();
  }

  async start() {
    await this.server.register([{
      plugin: hapiSlackCommand,
      options: this.options
    },
    {
      plugin: hapiLogr,
      options: {
        reporters: {
          flat: {
            reporter: 'logr-flat',
            options: {}
          }
        }
      }
    }
    ]);
    await this.server.start();
    this.server.log(['slack-command'], 'Slack-command server is started');
  }
}

module.exports = SlackCommand;
