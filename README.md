Smoke will be a JS build tool that will replace [Interleave](https://github.com/DamonOehlman/interleave).  A lot has been learned over the last six months and it's time to start with a clean slate and create a tool that make it a breeze to build re-usable, tested JS for as many environments as possible.

__CURRENT STATUS:__ [Call for Issues](https://github.com/DamonOehlman/smoke/issues/new)

You know best what you need in a build tool.  I only know what I need.  To make sure what is developed meets the broadest possible requirements please log issues and engage in discussion.

## General Design Goals

1. Very [Stream](http://nodejs.org/docs/latest/api/stream.html) centric.
2. Pluggable API
3. Do as little as possible in the core, with composition through streams (1) and an API (2) this should be absolutely fine.