# Smoke

Smoke will be a JS build tool that will replace [Interleave](https://github.com/DamonOehlman/interleave).  A lot has been learned over the last six months and it's time to start with a clean slate and create a tool that make it a breeze to build re-usable, tested JS for as many environments as possible.

__CURRENT STATUS:__ [Call for Issues](https://github.com/DamonOehlman/smoke/issues)

You know best what you need in a build tool.  I only know what I need.  To make sure what is developed meets the broadest possible requirements please [log issues](https://github.com/DamonOehlman/smoke/issues/new) and engage in discussion.

## Use Grunt

After working with the [Grunt API](https://github.com/cowboy/grunt/blob/master/docs/api.md) and successfully integrating Rigger with grunt (via the [grunt-rigger plugin](https://github.com/DamonOehlman/grunt-rigger)) it's highly unlikely that I'm going to put any effort into building __yet another build tool__.  Grunt will likely to exactly what you need, and it's got some great features already baked in that make it a whole pile of JS build yumminess.  You should definitely try it out!

## General Design Goals

1. Very [Stream](http://nodejs.org/docs/latest/api/stream.html) centric.
2. Pluggable API
3. Do as little as possible in the core, with composition through streams (1) and an API (2) this should be absolutely fine.

## Component Pieces

Some of the component pieces required to build smoke have already been built:

1. [Rigger](/DamonOehlman/rigger) - Include files in other files
2. [StreamClean](/DamonOehlman/streamclean) - Remove or change lines in a stream
3. [Pipeline](/pgte/pipeline) or [event-stream](/dominictarr/event-stream) - useful helpers for combining streams, and in event event-stream's case nice helpers for making an async function slot into a piped stream simply.
4. [jshint](https://github.com/jshint/node-jshint)
5. [UglifyJS](https://github.com/mishoo/UglifyJS)