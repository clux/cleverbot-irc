var CleverBot = new require('cleverbot-node')
  , clever = new CleverBot()
  , echoProtection = require('./echo_protection')
  , fullmoonSpiceup = require('./fullmoon_spiceup');

/**
 * insult code
 * used to notify in channel if we are ignoring a person
 */
const ignoreMax = 3600;
var insult = (function () {
  var insults = [
    '.',
    '..',
    'Get lost.',
    '...',
    'You should be wcforking.',
    'This is not a productive area of discussion.',
    'Do you even lift?'
  ];
  var insIdx = -1;
  return function () {
    insIdx = (insIdx + 1) % insults.length;
    return insults[insIdx];
  };
}());


module.exports = function (gu) {

  gu.on(/(.*)/, function (message, user) {
    if (!echoProtection.isIgnored(user)) {
      if (echoProtection.isTooSimilar(user, message)) {
        gu.say(user + ': ' + insult());
        return echoProtection.ignore(user, ignoreMax);
      }

      // pass message on to cleverbot
      clever.write(message, function (data) {
        // remember the last thing `user` got returned to him
        // so we can verify that he doesn't simply echo it back
        echoProtection.remember(user, data.message);


        // do fancy things to the message on full moons
        gu.say(user + ': ' + fullmoonSpiceup(data.message));
      });
    }
  });
};
