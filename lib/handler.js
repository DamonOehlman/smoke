var async = require('async'),
    fs = require('fs'),
    Pipeline = require('pipeline'),
    minimatch = require('minimatch'),
    sniff = require('sniff');

function FileHandler(pattern) {
    this.pipeline = [];
    this.pattern = pattern;
}

FileHandler.prototype = {
    process: function(smoker, basepath, opts, targetFile, callback) {
        var filePipeline = [], done = false;
        
        function _processDone(err) {
            if (! done) {
                done = true;
                callback(err);
            }
        }
        
        async.map(
            this.pipeline,
            
            // ensure items are valid streams
            // if not, then convert using the converter syntax
            function(item, itemCallback) {
                if (typeof item == 'function') {
                    item(smoker, basepath, opts, targetFile, itemCallback);
                }
                else {
                    itemCallback(null, item);
                }
            },
            
            // take the mapped results and process as a pipelined stream
            function(err, results) {
                var dest, done = false;
                
                // if we have an error, then abort
                if (err) {
                    callback(err);
                    return;
                }
                
                // create the pipeline and run it
                Pipeline([fs.createReadStream(targetFile)].concat(results))
                    .pipe()
                    .on('error', _processDone)
                    .on('close', _processDone)
                    .on('end', _processDone);
            }
        );
    },
    
    shouldProcess: function(targetFile) {
        return sniff(this.pattern) === 'regexp' ? 
            this.pattern.test(targetFile) : 
            minimatch(targetFile, this.pattern);
    }
};

module.exports = FileHandler;