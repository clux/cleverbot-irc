var CleverBot = new require('cleverbot-node')
  , clever = new CleverBot()
  , dye = require('dye')
  , Levenshtein = require('levenshtein')
  , format = require('util').format
  , sunCalc = require('suncalc');

/**
 * insult code
 * used to notify in channel if we are ignoring a person
 * or in pms without the correct password
 */
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


/**
 * Full Moon Based Zalgolizer
 * when moon is sufficiently full, clvr speaks with the zalgolizer
 * the zalgolizer grows more intense the closer to full moon it is
 */
const fullMoonCutoff = 0.95;
var getZalgoIntensities = function () {
  var len = 1 - fullMoonCutoff;
  var dist = sunCalc.getMoonFraction(Date.now()) - fullMoonCutoff;
  if (dist < 0) {
    // not a full moon!
    return [0, 0, 0];
  }
  // full moon
  var max = dist/len;
  console.log(dye.magenta('full moon intensity at ' + max + '%'));

  // [0, 0, 0] at [0, fullMoonCutoff), [10, 6, 10] at full moon (=1)
  // linear interpolation in the range [fullMoonCutoff, 1]
  return [
    Math.ceil(10*max),
    Math.ceil(6*max),
    Math.ceil(10*max)
  ];
};

var repeats = {}; // maintains last said thing for a user
var ignores = [];
const ignoreMax = 3600;

module.exports = function (gu) {

  gu.on(/(.*)/, function (content, from) {
    if (ignores.indexOf(from) >= 0) {
      return; // ignored person
    }
    // repeat messengers should not echo back 'basically' what cleverbot said
    if (repeats[from]) {
      var ld = new Levenshtein(repeats[from], content);
      if (ld.distance < content.length/8) {
        var ignoreTime = Math.ceil(ignoreMax*1000*Math.random());
        console.log(dye.yellow(
          'ignoring ' + from + ' for ' + Math.floor(ignoreTime/1000) + 's'
        ));
        ignores.push(from);
        gu.say(from + ": " + insult());

        setTimeout(function () {
          console.log(dye.yellow(format('unignoring', from)));
          ignores.splice(ignores.indexOf(from), 1);
        }, ignoreTime);
        return;
      }
    }

    // pass data onto cleverbot
    clever.write(content, function (data) {
      // cache response for user so we can catch if they mime on next message
      repeats[from] = data.message;

      // get message and zalgolize if close to full moon
      var resp = dye.zalgo(data.message, 0.1, getZalgoIntensities());
      gu.say(from + ': ' + resp);
    });
  });

};
