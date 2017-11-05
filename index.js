'use strict';
const Hapi = require('hapi');
const boom = require('boom');

const defaults = {
  routeToListen: '/',
};

class SlackCommand {
  constructor(token, options, server) {
    this.options = Object.assign({}, defaults, options || {});
    this.server = server || '';
    this.token = token;
    this.commands = {};
  }

  register(command, commandHandlers) {
    this.commands[command] = commandHandlers;
  }

  stop(callback) {
    this.server.stop(callback);
  }

  handler(request, reply) {
    const slackCommand = this;
    // make sure the token matches:
    if (request.payload.token !== slackCommand.token) {
      return reply(boom.unauthorized(request));
    }
    // make sure that command exists:
    const commandHandler = slackCommand.commands[request.payload.command];
    if (commandHandler === undefined) {
      return reply(boom.methodNotAllowed());
    }
    // a method to invoke commands:
    const invokeCommand = (commandMethod, match) => {
      const invokeCallback = (err, commandResult) => {
        if (err) {
          return reply(boom.wrap(err));
        }
        return reply(null, commandResult);
      };
      if (!match) {
        return commandMethod(request.payload, invokeCallback);
      }
      return commandMethod(request.payload, match, invokeCallback);
    };
    // if there's only one command-handling method then run it:
    if (typeof commandHandler === 'function') {
      return invokeCommand(commandHandler);
    }
    // if that doesn't exist, try to find a command-handler that matches the text:
    const requestedSubcommand = request.payload.text;
    const subCommands = Object.keys(commandHandler);
    for (let i = 0; i < subCommands.length; i++) {
      const commandToMatch = subCommands[i];
      // don't try to match '*', it's the fallback:
      if (commandToMatch === '*') {
        continue;
      }
      const isMatched = requestedSubcommand.match(new RegExp(commandToMatch, ['i']));
      if (isMatched !== null) {
        return invokeCommand(commandHandler[commandToMatch], isMatched);
      }
    }
    // if nothing was found to match, try '*', the fallback method:
    if (commandHandler['*']) {
      return invokeCommand(commandHandler['*']);
    }
    // if nothing was found and no fallback defined, treat as error:
    return reply(boom.methodNotAllowed);
  }

  listen(port, callback) {
    if (!this.server) {
      this.server = new Hapi.Server();
      this.server.connection({ port });
    }
    const handler = this.handler.bind(this);
    this.server.route({
      method: 'POST',
      path: this.options.routeToListen,
      handler
    });
    if (this.server.info.started === 0) {
      this.server.start(() => {
        if (typeof callback === 'function') {
          return callback();
        }
      });
    }
  }
}

module.exports = SlackCommand;
