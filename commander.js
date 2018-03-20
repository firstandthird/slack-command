const fs = require('fs');
const path = require('path');

const register = (server, options) => {
  const commandDir = server.settings.app.commandsDir;
  if (fs.existsSync(commandDir)) {
    fs.readdirSync(commandDir).forEach(file => {
      const command = require(path.join(commandDir, file));
      server.slackCommand.register(command.expression, command.handler, command.description);
    });
  }
};

exports.plugin = {
  name: 'slack-command',
  register,
  once: true,
  pkg: require('./package.json')
};
