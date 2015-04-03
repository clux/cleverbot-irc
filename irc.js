#!/usr/bin/env node
var cfgPath = require('confortable')('.clvr.json', process.cwd());
if (!cfgPath) {
  throw new Error("When loading cleverbot-irc externally, a local config is required");
}
var cfg = require(cfgPath);

var ircStream = require('irc-stream')(cfg.server, cfg.name, cfg.irc, cfg.stream);
var clvr = require('./');

ircStream.pipe(clvr.gu()).pipe(ircStream);
