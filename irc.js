#!/usr/bin/env node
var cfgPath = require('confortable')('.clvr.json', process.cwd());

if (!cfgPath) {
  throw new Error("When loading wolfram-irc externally, a local config is required");
}
console.log('using: ' + cfgPath);
var cfg = require(cfgPath);

require('gu')(cfg.server, cfg.name, {
  userName: 'IAmA',
  realName: 'clever',
  debug: false,
  channels: [cfg.chan],
}, require('path').join(__dirname, 'bot'), ['clvr.js']);
