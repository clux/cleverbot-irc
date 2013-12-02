# cleverbot-irc
[![Dependency Status](https://david-dm.org/clux/cleverbot-irc.png)](https://david-dm.org/clux/cleverbot-irc)
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

A simple and fun IRC bot that connects to a server/channel of choice and will relay any messages addressed to it in the channel to [Cleverbot](http://http://www.cleverbot.com/) for public humiliation/laughs.

## Usage/Installation
Install and modify the default config file to suit your needs:

```bash
npm install -g cleverbot-irc
curl https://raw.github.com/clux/cleverbot-irc/master/.clvr.json > .clvr.json
gedit .clvr.json
clvrbot
```

Alternatively, if you want to fork and work directly:

```bash
git clone https://github.com/clux/cleverbot-irc.git
cd cleverbot-irc
npm install
gedit .clvr.json
npm start
```

## Quirks
Because spare time.

- `clvr` will go a little crazy close to every full moon
- imitating the responses of `clvr` back to her can get you ignored for some time

This is the main reason for the experimental tag; no guarantees on how this behaviour changes.

Because otherwise this module would be a super short. In fact, this short:

```js
var CleverBot = new require('cleverbot-node');
var clever = new CleverBot();
module.exports = function (gu) {
  gu.handle(/(.*)/, function (say, message, user) {
    clever.write(message, function (data) {
      say(data.message);
    });
  });
};
```

You don't need me for that.

## Internal Highlights

```
<ob> clvr: are you more intelligent than daisy?
<clvr> ob: Yes.
<ob> i find that hard to believe
<daisy> DAISY
```

```
<littlerob> clvr: is it dubious?
<clvr> littlerob: Your face is dubious.
```

```
<ob> clvr: DAISY
<clvr> ob: Give me your answer do.
<LuTomlin> :D
<ob> eh
<LuTomlin> clvr: I'm half crazy
<clvr> LuTomlin: All for the love of you.
<LuTomlin> :D
<seabee> clvr: are you a 9000 series?
<clvr> seabee: Yes. I know that I am insignificant on the large scale, and that there is so much going on that is beyond my existence.
<seabee> were fucked
```

```
<clvr> ob: What is ego?
<littlerob> bit of a harder question
<littlerob> than the last one
<ob> clvr: A person's sense of self-esteem or self-importance:  "a boost to my ego".The  part of the mind hat mediates between the conscious and the  unconscious and is responsible for reality testing and a sense of...
<clvr> ob: The superego.
<littlerob> clvr: the ego is clearly not the superego
<littlerob> that's the point
<rwge> your mother is clearly not the superego
<clvr> littlerob: Chocolate cake without carrots is not on a tigers daily menu.
<ob> good response
<littlerob> certainly stumped me
```

## License
MIT-Licensed. See LICENSE file for details.
