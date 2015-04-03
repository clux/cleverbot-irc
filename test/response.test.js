var Gu = require('gu')
  , guParams = require('../')
  , sulfur = require('sulfur');

exports.response = function (t) {
  var clvr = new Gu(guParams.scriptdir, guParams.files, { noReload: true });
  sulfur.absorb(clvr.log, 'gu');
  var xs = [
    {user: '#chan:clux', name: 'clux', message: 'hi clvr'},
  ];
  xs.forEach(function (x) {
    clvr.write(x);
  });

  clvr.addListener('readable', function () {
    var resp = clvr.read();
    t.ok(resp, 'got a response');
    t.done();
  });
};
