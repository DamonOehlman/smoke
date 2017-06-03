const debug = require('debug')('smoke');
const async = require('async');
const glob = require('glob');
const flatten = require('whisk/flatten');

const patterns = [
  '**/*.entry.js',
  '**/*.entry.es6',
  '**/*.entry.css'
];

const builders = {
  'js': require('./lib/buildjs'),
  'es6': require('./lib/buildjs'),
  'css': require('./lib/buildcss')
};

/**

# smoke

Smoke is an opinionated build tool. It's pretty much the polar opposite to
[webpack](https://github.com/webpack/webpack) as it only provides the configuration
options for the tools that it is configured for below.

## Unfeatures

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

## Usage

1. Make a directory for your application.
2. Create any number of `*.entry.js` files and `*.entry.css` files in the
  directory structure in this directory (with the exception of the `test/` directory,
  which is reserved for any tests you decide to write).
3. Add any of the tool specific configuration files to the application directory.
4. Run `smoke`

## Processing Pipeline

To be completed.

**/

module.exports = (opts, callback) => {
  async.map(patterns, glob, (err, allEntryPoints) => {
    if (err) {
      return callback(err);
    }

    const entryPoints = allEntryPoints.reduce(flatten);
    console.log(entryPoints);
  });
};
