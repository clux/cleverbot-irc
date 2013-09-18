var zalgo = require('dye').zalgo
  , sunCalc = require('suncalc')
  , col = require('irc-colors');

/**
 * Full Moon Spiceup
 * when moon is sufficiently full, clvr speaks with modifications
 * the modifications become more intense closer to the full moon
 */
const cutOff = 0.95; // "how full" does a moon have to be to be considered full
var moonIntensity = function (d) {
  // (moonFraction - cutOff) is how far into the "full moon" interval we are
  // (1 - cutOff) is the length of that interval
  // => moon { 0 if outside interval, between 0 and 1 inside interval, 1 at peak}
  return Math.max(0, (sunCalc.getMoonFraction(d) - cutOff)/(1 - cutOff));
};

var comp = function (f, g) {
  return function (x) {
    return f(g(x));
  };
};

var colorMap = function (intensity) {
  var fnProgress = [
    col.aqua,   // .1
    col.violet, // .3
    comp(col.bold, col.olive), // .4
    comp(col.bold, col.pink), // .6
    col.rainbow, // .7
    comp(col.bold, col.rainbow)
  ];
  var l = fnProgress.length;
  var idx = Math.min(l - 1, Math.floor(intensity * l)); // map intensity to prog idx
  return  fnProgress[idx];
};


module.exports = function (resp) {
  var d = new Date();
  var intensity = moonIntensity(d);
  if (intensity > 0) { // full moon

    // sometimes colorize
    if (d.getMonth() % 2) {
      return colorMap(intensity)(resp);
    }

    // sometimes zalgolize
    return zalgo(resp, 0.1, [
      Math.ceil(10*intensity),
      Math.ceil(6*intensity),
      Math.ceil(10*intensity)
    ]);
  }
  return resp;
};
