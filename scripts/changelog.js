var clog   = require('conventional-changelog');
var path   = require('path');
var fs     = require('vinyl-fs');
var source = require('vinyl-source-stream');

function conventionalChangelog(done) {
    clog({
            preset: 'angular',
            // repository: 'https://github.com/router5/router5',
            // append: false
        })
        .pipe(source('CHANGELOG.md'))
        .pipe(fs.dest(path.join(__dirname, '..')));
}

conventionalChangelog(function (err) {
    process.exit(err ? 1 : 0);
});
