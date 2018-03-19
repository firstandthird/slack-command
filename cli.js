#!/usr/bin/env node

const Rapptor = require('rapptor');

const main = async function() {
  const service = new Rapptor({
    configPath: `${__dirname}/conf`,
    configFile: process.cwd(),
    configPrefix: 'slack-command',
    context: {
      LIBDIR: __dirname
    }
  });
  await service.start();
};
main();
