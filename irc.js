#!/usr/bin/env node
var cfgPath = require('confortable')('.clvr.json', process.cwd());
if (!cfgPath) {
  throw new Error("When loading wolfram-irc externally, a local config is required");
}
var cfg = require(cfgPath);

var join = require('path').join;
var gu = require('gu')(join(__dirname, 'bot'), ['clvr.js']);
var ircStream = require('irc-stream')(cfg.server, cfg.name, {
  userName: 'IAmA',
  realName: 'clever',
  debug: false,
  channels: [cfg.chan],
});

ircStream.pipe(gu).pipe(ircStream);
