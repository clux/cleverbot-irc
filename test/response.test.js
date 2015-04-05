var Gu = require('gu')
  , guParams = require('../')
  , sulfur = require('sulfur');

exports.response = function (t) {
  var clvr = new Gu(guParams.scriptdir, guParams.files, { noReload: true });
  sulfur.absorb(clvr.log, 'gu');
  clvr.write({user: 'clux', channel: '#test', message: 'hi clvr'});

  clvr.on('readable', function () {
    var resp = clvr.read();
    t.ok(resp, 'got a response');
    t.equal(resp.user, 'clux', 'addressed to me');
    t.equal(resp.channel, '#test', 'in requested channel');
    // TODO: if it starts failing - create a test to ensure
    // resp is not equal to "<html>"" or whatever it returns when permissions fail
    t.done();
  });
};
