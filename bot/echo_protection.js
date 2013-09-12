var Levenshtein = require('levenshtein');

var responses = {}; // maintains the list of last sentences said to each user
var ignores = []; // maintains the ignore list

// checks if `user` is ignored
exports.isIgnored = function (user) {
  return ignores.indexOf(user) >= 0;
};

// remember the last thing said to `user`
exports.remember = function (user, resp) {
  responses[user] = resp;
};

// returns if last thing `user` said is close to the last thing WE said
exports.isTooSimilar = function (user, msg) {
  if (!responses[user]) {
    return false;
  }
  var ld = new Levenshtein(responses[user], msg);
  return (ld.distance < msg.length/8);
};

// ignores `user` for up to ignoreMax seconds
exports.ignore = function (user, ignoreMax) {
  var ignoreTime = Math.ceil(ignoreMax*1000*Math.random());
  console.log('ignoring', user, 'for', Math.floor(ignoreTime/1000) + 's');
  ignores.push(user);

  setTimeout(function () {
    console.log('unignoring:', user);
    ignores.splice(ignores.indexOf(user), 1);
  }, ignoreTime);
  return ignoreTime;
};
