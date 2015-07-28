var clog    = require('conventional-changelog');
var path    = require('path');
var vfs     = require('vinyl-fs');
var fs      = require('fs')
var source  = require('vinyl-source-stream2');
var through = require('through2');

function conventionalChangelog(done) {
    clog({
            preset: 'angular',
            // repository: 'https://github.com/router5/router5',
            // append: false
        })
        .pipe(source('CHANGELOG.md'))
        .pipe(through.obj(function (file, enc, cb) {
            fs.readFile(path.join(__dirname, '../CHANGELOG.md'), function (err, res) {
                if (err) cb(err);
                else {
                    file.contents = new Buffer(file.contents.toString() + res.toString());
                    cb(null, file);
                }
            });
        }))
        .pipe(vfs.dest(path.join(__dirname, '..')));
}

conventionalChangelog(function (err) {
    process.exit(err ? 1 : 0);
});
