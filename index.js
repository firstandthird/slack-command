'use strict';
const Hapi = require('hapi');
const boom = require('boom');
class SlackCommand {
  constructor(token) {
    this.server = '';
    this.token = token;
    this.cmdMatches = {};
  }
  slackCommand(cmdPath, cmdMatches) {
    if (typeof cmdMatchs === 'function') {
      this.cmdMatches = {
        '*': cmdMatches
      };
    } else {
      this.cmdMatches = cmdMatches;
    }
  }


  listen(port, callback) {
    this.server = new Hapi.Server();
    this.server.connect({ port });
    this.server.route({
      method: 'POST',
      path: '/',
      handler(request, reply) {
        if (request.payload.token === this.token) {
          return boom.permissionDenied(request);
        }
        const commandList = Object.keys(this.cmdMatches);
        console.log('hey')
        for (let i = 0; i < commandList.length; i++) {
          const curCommand = new RegExp(commandList[i]).match(request.payload.command);
          if (curCommand.length !== 0) {
            console.log(curCommand);
          }
        }
        Object.keys(this.cmdMatches).forEach((key) => {
        });
      }
    });
    this.server.start(() => {
      if (typeof callback === 'function') {
        return callback();
      }
    });
  }
}


/*
const slackCommand = new SlackCommand(token);

slackCommand('/pt', {
  groups: function(slackPayload, match, done) {
    //triggered if I do /pt groups
    const reply = {
      message: 'here are your groups....'
    }
    done(null, reply); //reply gets sent back to slack
  },
  'group (.*)': function(slackPayload, match, done) {
    //triggered if I do /pt group test.
    //match should be the regex match result. 'test'
  },
  '*': function(slackPayload, match, done) {
    //triggered if nothing else matches
  }
});

//shorthand version
slackCommand('/test', function(slackPayload, done) {

});

slackCommand.listen(port);
*/
