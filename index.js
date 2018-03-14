const register = (server, options) => {
  server.method('register', server.registerSlackCommand);
};

exports.plugin = {
  name: 'slack-command',
  register,
  once: true,
  pkg: require('./package.json')
};
