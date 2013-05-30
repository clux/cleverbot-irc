
#!/usr/bin/env node
var CleverBot = new require('cleverbot-node')
  , clever = new CleverBot()
  , irc = require('irc')
  , dye = require('dye')
  , Levenshtein = require('levenshtein')
  , format = require('util').format
  , sunCalc = require('suncalc')
  , cfgPath = require('confortable')('.clvr.json', process.cwd());

console.log(dye.green('using: ' + cfgPath));
var cfg = require(cfgPath);

var bot = new irc.Client(cfg.server, cfg.name, {
  userName: 'IAmA',
  realName: 'clever',
  debug: false,
  channels: [cfg.chan],
});

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

/**
 * discoverer code
 * used to indicate a presence in channel without being talked to directly
 */
var discReg = new RegExp(cfg.name + '.*\\?');
var discoverer = (function () {
  var discoverers = [
    '?',
    'ask me a question',
    'what?'
  ];
  var discIdx = 0;
  return function () {
    discIdx = (discIdx + 1) % discoverers.length;
    return discoverers[discIdx];
  };
}());


/**
 * Full Moon Based Zalgolizer
 * when moon is sufficiently full, clvr speaks with the zalgolizer
 * the zalgolizer grows more intense the closer to full moon it is
 */
var getZalgoIntensities = function () {
  var len = 1 - cfg.fullMoonCutoff;
  var dist = sunCalc.getMoonFraction(Date.now()) - cfg.fullMoonCutoff;
  if (dist < 0) {
    // not a full moon!
    return [0, 0, 0];
  }
  // full moon
  var max = dist/len;
  console.log(dye.magenta('full moon intensity at ' + max + '%'));

  // upper maximum is [10, 6, 10] at full moon
  return [
    Math.ceil(10*max),
    Math.ceil(6*max),
    Math.ceil(10*max)
  ];
};

/**
 * channel handler
 */
var chanReg = new RegExp('^' + cfg.name + '[\\s,\\:](.*)');

var repeats = {}; // maintains last said thing for a user
var ignores = [];

bot.addListener('message' + cfg.chan, function (from, msg) {
  console.log(dye.blue(format(from, 'in', cfg.chan + ':', msg)));

  // cleverbot
  if (chanReg.test(msg)) {
    var content = msg.match(chanReg)[1].trim();

    if (!content || ignores.indexOf(from) >= 0) {
      return; // empty string or ignored guy
    }

    // repeat messengers should not echo back 'basically' what cleverbot said
    if (repeats[from]) {
      var ld = new Levenshtein(repeats[from], content);
      if (ld.distance < content.length/8) {
        var ignoreTime = Math.ceil(cfg.ignoreMax*1000*Math.random());
        console.log(dye.yellow(
          'ignoring ' + from + ' for ' + Math.floor(ignoreTime/1000) + 's'
        ));
        ignores.push(from);
        bot.say(cfg.chan, from + ": " + insult());

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
      bot.say(cfg.chan, from + ': ' + resp);
    });
  }

  // discoverability
  else if (discReg.test(msg)) {
    bot.say(cfg.chan, from + ': ' + discoverer());
  }
});


/**
 * PMS
 * either insults you, or allows you to talk through him via 'PASS: msg'
 */
var pmReg = new RegExp('^' + cfg.pmPass + '\\:\\s*(.*)');

bot.addListener('pm', function (nick, msg) {
  console.log(dye.green(format(nick, 'in pm', msg)));
  if (pmReg.test(msg)) {
    var match = msg.match(pmReg)
      , chan = cfg.chan
      , cmd = match[1];
    bot.say(chan, cmd);
  }
  else {
    bot.say(nick, insult());
  }
});


// only errors are unhandled message types I think
bot.addListener('error', function (message) {
  console.warn(dye.red('error:'), message);
});
