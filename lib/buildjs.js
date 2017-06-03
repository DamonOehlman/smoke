const rollupify = require('rollupify');
const babelify = require('babelify');
const browserify = require('browserify');

const baseRollupPlugins = [
  require('rollup-plugin-babel')({
    exclude: [
      'node_modules/**',
      'test/**'
    ]
  })
];

