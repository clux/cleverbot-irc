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

## Internal Highlights

- <ob> clvr: are you more intelligent than daisy?
- <clvr> ob: Yes.
- <ob> i find that hard to believe
- <daisy> DAISY


- <littlerob> clvr: is it dubious?
- <clvr> littlerob: Your face is dubious.


- <ob> clvr: DAISY
- <clvr> ob: Give me your answer do.
- <LuTomlin> :D
- <ob> eh
- <LuTomlin> clvr: I'm half crazy
- <clvr> LuTomlin: All for the love of you.
- <LuTomlin> :D
- <seabee> clvr: are you a 9000 series?
- <clvr> seabee: Yes. I know that I am insignificant on the large scale, and that there is so much going on that is beyond my existence.
- <seabee> were fucked


- <clvr> ob: What is ego?
- <littlerob> bit of a harder question
- <littlerob> than the last one
- <ob> clvr: A person's sense of self-esteem or self-importance:  "a boost to my ego".The  part of the mind that mediates between the conscious and the  unconscious and is responsible for reality testing and a sense of...
- <clvr> ob: The superego.
- <littlerob> clvr: the ego is clearly not the superego
- <littlerob> that's the point
- <rwge> your mother is clearly not the superego
- <clvr> littlerob: Chocolate cake without carrots is not on a tigers daily menu.
- <ob> good response
- <littlerob> certainly stumped me

## License
MIT-Licensed. See LICENSE file for details.
