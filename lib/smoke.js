var async = require('async'),
    debug = require('debug')('smoke'),
    nopt = require('nopt'),
    fs = require('fs'),
    path = require('path'),
    out = require('out'),
    util = require('util'),
    vm = require('vm'),
    smoker = require('./smoker'),
    
    cmdline = {
        known: {
            'path': path,
            'filename': 'String'
        },
        
        shorthand: {}
    },
    
    reLeadingDashes = /^\-+/;

function smoke(opts, callback) {
    var buildfile;
    
    // if we have no arguments, then check the command line args
    if (arguments.length === 0) {
        opts = nopt(cmdline.known, cmdline.shorthand, process.argv, 2);
    }
    else if (typeof opts == 'function') {
        callback = opts;
        opts = {};
    }

    // ensure we have options
    opts = opts || {};
    
    // ensure we have a callback
    callback = callback || function(err) {
        if (err) {
            out('!{red}{0}', err);
        }
    };
    
    // initialise the target build file name
    buildfile = path.resolve(opts.path, opts.filename || 'smoke.js');
    
    // look for a smoke.js file in the path
    fs.exists(buildfile, function(exists) {
        if (! exists) {
            callback(new Error('Unable to find buildfile: ' + buildfile));
            return;
        }

        // read the contents of the build file and run it in this context
        debug('reading build file: ' + buildfile);
        fs.readFile(buildfile, 'utf8', function(err, data) {
            var context;
            
            if (err) {
                callback(err);
                return;
            }
            
            // create the context
            debug('creating buildfile context');
            context = smoker.createContext(buildfile);
            
            // running the context
            debug('running the buildfile in the smoker context');
            vm.runInContext(data, context, buildfile);

            // TODO: sort in order of dependencies
            
            
            // process the smokers
            async.forEach(
                context.smokers,
                function(smoker, itemCallback) {
                    smoker.process(path.dirname(buildfile), opts, itemCallback);
                },
                callback
            );
        });
    });
}

module.exports = smoke;