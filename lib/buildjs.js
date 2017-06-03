const debug = require('debug')('smoke:build:js');
const rollupify = require('rollupify');
const babelify = require('babelify');
const browserify = require('browserify');
const rollupBabelPlugin = require('rollup-plugin-babel');

const baseRollupPlugins = [
  rollupBabelPlugin({
    exclude: [
      'node_modules/**',
      'test/**'
    ]
  })
];

module.exports = (entryPoint, callback) => {
  debug('building:', entryPoint);
  callback();
};

