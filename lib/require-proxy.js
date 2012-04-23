var debug = require('debug')('smoke-require'),
    formatter = require('formatter'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    fsProxy = _.clone(fs);
    
fsProxy.createWriteStream = function(targetPath) {
    return function(smoker, basepath, opts, filename, callback) {
        var outputFile = path.resolve(basepath, targetPath),
            data = {
                filename: path.basename(filename),
                ext: path.extname(filename)
            },
            actualTarget;
            
        // add the basename
        data.basename = path.basename(filename, data.ext);
        
        // get the actual target path
        actualTarget = formatter(outputFile)(data);
        
        // ensure the directory exists
        mkdirp(path.dirname(actualTarget), function(err) {
            if (err) {
                callback(err);
            }
            else {
                debug('created write stream for file: ' + actualTarget);
                callback(null, fs.createWriteStream(actualTarget));
            }
        });
    };
};

module.exports = function(target) {
    switch (target) {
        case 'fs': 
            return fsProxy;
            
        case 'dummy': 
            break;
        
        default: 
            return require(target);
    }
};