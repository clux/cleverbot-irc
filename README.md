# cleverbot-irc
A simple and fun IRC bot that connects to a server/channel of choice and will relay any messages addressed to it in the channel to [Cleverbot](http://http://www.cleverbot.com/) for public humiliation/laughs.

## Usage/Installation
Install and modify the default config file to suit your needs:

```bash
npm install -g cleverbot-irc
curl https://raw.github.com/clux/cleverbot-irc/master/.clvr.json > .clvr.json
gedit .clvr.json # you must change the first 4 params in config
clvrbot
```

## Config options
The first 3 options are used directly to connect to IRC. Nickname, server, and channel to connect to.

`pmPass` is a password that can be set so you can hook into the bot and make it talk through private messages. When the default password "w00t" you can pm clvr with "w00t: hi person" and it will say "hi person" in the channel it's in.

`ignoreMax` is the max time in seconds to ignore a person in the channel that is echoing back what clever says. It's a random time up to that number to discourage gaming it. Note that it's just a simplistic spam protection method that compares the Levenshtein distance between what clever said last and what the person responds with.

`fullMoonCutoff` is a number between 0 and 1. If 1 then it's disabled, 0 always on. When close to a full moon (as determined by this number), clvr's output will be zalgolized with increasing intensity as the fullMoonFraction gets closer to 1.

## License
MIT-Licensed. See LICENSE file for details.
