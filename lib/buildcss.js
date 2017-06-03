const debug = require('debug')('smoke:build:css');

module.exports = function(entryPoint, callback) {
  debug('building:', entryPoint);
  callback();
};
