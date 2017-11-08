const SlackCommand = require('./slackCommand.js');

exports.register = function(server, options, next) {
  const slackCommand = new SlackCommand(options.token, options, server);
  server.decorate('server', 'registerSlackCommand', slackCommand.register.bind(slackCommand));
  slackCommand.listen();
  next();
};

exports.register.attributes = {
  name: 'slack-command'
};
