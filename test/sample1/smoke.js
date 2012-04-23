var rigger = require('rigger');

// smoke all source files in the src/js path
smoke('src/js/')
    // on any js file, rig it and create a dist file
    .match(/\.js$/i)
        .pipe(new rigger.Rigger())
        .pipe(smoke.out('dist/'));