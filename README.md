
# smoke

Smoke is an opinionated build tool. It's pretty much the polar opposite to
[webpack](https://github.com/webpack/webpack) with the following (un)features:

- No pluggable loaders (what you get is listed below).  In the case that these tools
do support configuration (which most of them do) you can still apply customisations
through the use of their normal configuration files.

- Babel compilation by default (yep ES6 module loading only)

- This is routed through [browserify](https://github.com/substack/node-browserify)
  so we can access useful browser friendly node modules in our applications. (e.g.
  [hyperquest](https://github.com/substack/hyperquest),
  [virtual-dom](https://github.com/Matt-Esch/virtual-dom), and others).  For
  more information see the information on the processing pipeline below.

- Rollup used for bundle optimization

- [PostCSS](https://github.com/postcss/postcss) used for CSS preprocessing.

- [ESLint](http://eslint.org/) for linting. 

- No live reload for development (see `smoke-dev-server`) because you really
can reload the page yourself...


[![NPM](https://nodei.co/npm/smoke.png)](https://nodei.co/npm/smoke/)

[![bitHound Score](https://www.bithound.io/github/DamonOehlman/smoke/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/smoke) 

## Usage

1. Make a directory for your application.
2. Create any number of `*.entry.js` files and `*.entry.css` files in the
directory structure in this directory (with the exception of the `test/` directory,
which is reserved for any tests you decide to write).
3. Add any of the tool specific configuration files to the application directory.
4. Run `smoke`.

## License(s)

### ISC

Copyright (c) 2017, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
