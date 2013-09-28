var CleverBot = new require('cleverbot-node')
  , clever = new CleverBot()
  , protection = require('./echo_protection')
  , maybeSpiceUp = require('./fullmoon_spiceup');

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
    'You should be working.',
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

  gu.handle(/(.*)/, function (say, message, user) {
    if (!protection.isIgnored(user)) {
      if (protection.isTooSimilar(user, message)) {
        protection.ignore(user, ignoreMax);
        say(insult());
      }
      else {
        // pass message on to cleverbot
        clever.write(message, function (data) {
          var resp = data.message;
          // remember the last thing `user` got returned to him
          // so we can verify that he doesn't simply echo it back
          protection.remember(user, resp);

          // do fancy things to the message on full moons
          say(maybeSpiceUp(resp));
        });
      }
    }
  });

};
