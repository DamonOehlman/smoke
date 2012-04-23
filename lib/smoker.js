var async = require('async'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    findit = require('findit'),
    Stream = require('stream').Stream,
    util = require('util'),
    vm = require('vm'),
    FileHandler = require('./handler'),

    reLeadingSlash = /^[\\\/]/,
    reSlashes = /[\\\/]/;

function Smoker(targetPath, opts) {
    // ensure we have options
    opts = opts || {};
    
    // save the target path
    this.targetPath = targetPath;
    
    // initialise the maxdepth
    // by default we only process the top level directory
    this.maxDepth = opts.maxDepth || 1;
    
    // initialise the basepath
    this.basepath = opts.basepath;
    
    // initialise the handlers array
    this.handlers = [];

    // initialise the active handler to empty
    this.targetHandler = null;
}

Smoker.prototype.match = function(pattern) {
    // add the handler to the list of current handlers
    this.targetHandler = this.handlers[this.handlers.length] = new FileHandler(pattern);
    
    // return for chaining
    return this;
};

Smoker.prototype.pipe = function(stream) {
    this._checkTarget();

    // add this stream to the list of streams that will be piped in the filehandler
    this.targetHandler.pipeline.push(stream);
    
    // return this for chaining
    return this;
};

Smoker.prototype.process = function(basepath, opts, callback) {
    var targetPath = path.resolve(this.basepath || basepath, this.targetPath),
        targetPathLength = targetPath.length,
        smoker = this,
        finder = findit.find(targetPath),
        worklist = [];
        
    finder.on('file', function(file, stats) {
        var relPath = file.slice(targetPathLength).replace(reLeadingSlash, ''),
            depth = relPath.split(reSlashes).length;
        
        // if the depth is acceptable, then process
        if (depth <= smoker.maxDepth) {
            // iterate through handlers and check for a match
            smoker.handlers.forEach(function(handler) {
                // if the handler should process this file then add
                // this file and handler combination to the worklist
                if (handler.shouldProcess(file)) {
                    worklist[worklist.length] = {
                        file: file,
                        handler: handler
                    };
                }
            });
        }
    });
    
    // when we have located all the files, then process the valid files
    finder.on('end', function() {
        async.forEach(
            worklist,
            
            function(item, itemCallback) {
                item.handler.process(smoker, basepath, opts, item.file, itemCallback);
            },
            
            callback
        );
    });
};

Smoker.prototype._checkTarget = function() {
    if (! this.targetHandler) {
        throw new Error('No target handler assigned, unable to apply rule');
    }
};

exports.createContext = function(buildfile) {
    
    var smokers = [];
    
    function smoke(targetPath, opts) {
        // ensure we have opts
        opts = opts || {};
        
        // initialise the basepath to the buildfile path
        opts.basepath = opts.basepath || path.dirname(buildfile);
        
        // create the new smoker
        return (smokers[smokers.length] = new Smoker(targetPath, opts));
    }
    
    return vm.createContext({
        require: require('./require-proxy'),
        
        smoke: smoke,
        smokers: smokers
    });
};
