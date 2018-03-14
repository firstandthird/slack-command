const fs = require('fs');
const path = require('path');

const register = (server, options) => {
  const commandDir = server.settings.app.commandsDir;
  if (fs.existsSync(commandDir)) {
    fs.readdirSync(commandDir).forEach(file => {
      const command = require(path.join(commandDir, file));
      server.registerSlackCommand(command.expression, command.handler);
    });
  }
};

exports.plugin = {
  name: 'slack-command',
  register,
  once: true,
  pkg: require('./package.json')
};
