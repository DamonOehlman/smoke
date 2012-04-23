var Pipeline = require('pipeline'),
    minimatch = require('minimatch'),
    sniff = require('sniff');

function FileHandler(pattern) {
    this.pipeline = Pipeline();
    this.pattern = pattern;
}

FileHandler.prototype = {
    shouldProcess: function(targetFile) {
        return sniff(this.pattern) === 'regexp' ? 
            this.pattern.test(targetFile) : 
            minimatch(targetFile, this.pattern);
    }
};

module.exports = FileHandler;