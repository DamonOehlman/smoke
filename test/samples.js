var path = require('path'),
    fs = require('fs'),
    samplesPath = path.resolve(__dirname, 'samples'),
    smoke = require('../lib/smoke');
    
fs.readdir(samplesPath, function(err, files) {
    describe('build samples', function() {
        (files || []).forEach(function(file) {
            var targetPath = path.join(samplesPath, file);
        
            it('should be able to build: ' + file, function(done) {
                smoke({ path: targetPath }, done);
            });
        });
    });
});