var Gu = require('gu')
  , guParams = require('../')
  , ircColors = require('irc-colors')
  , sulfur = require('sulfur');

exports.response = function (t) {
  var guOpts = { noReload: true };
  var injected = { ignoreMax: 2 }; // only ignore us for up to 2s
  var clvr = new Gu(guParams.scriptdir, guParams.files, guOpts, injected);
  sulfur.absorb(clvr.log, 'gu');
  clvr.write({
    user: 'clux', channel: '#test',
    message: 'You are a pretty awesome person.'
  });

  var sent = 0;
  clvr.on('readable', function () {
    var resp = clvr.read();
    t.ok(resp, 'got a response');
    t.equal(resp.user, 'clux', 'addressed to me');
    t.equal(resp.channel, '#test', 'in requested channel');
    if (sent === 1) {
      t.equal(resp.message, '.', 'mimicing got us ignored');
    }
    // TODO: if it starts failing - create a test to ensure
    // resp is not equal to "<html>"" or whatever it returns when permissions fail

    // kill full-moon shenanigans - mostly - can't really sanitize zalgo
    var msg = ircColors.stripColorsAndStyle(resp.message);
    if (sent === 0 && msg.length > 8) {
      var echo = msg.replace(/./, 'x'); // slightly modify return
      sent += 1;
      clvr.write({ user: 'clux', channel: '#test', message: echo });
      // too similar re-write (1/8th of length levenshtein dist) gets us ignored
    }
    else {
      t.done(); // will wait for ignore timer
    }
  });
};
