'use strict';
const tap = require('node-tap');
const SlackCommand = require('../index.js');
const test = tap.Test;

test('can launch server', (t) => {
  const slackCommand = new SlackCommand('a token');
  slackCommand.listen(8080, () => {
    console.log('listening')
    t.end();
  });
});
