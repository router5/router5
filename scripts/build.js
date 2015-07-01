var babel       = require('babel');
var path        = require('path');
var fs          = require('fs');
var async       = require('async');

var getOptions  = require('./babel-options');
var fileName    = path.join(__dirname, '../modules/Router5.js');

function buildFactory(module, dest) {
    return function buildCommonJsModuel(done) {
        babel.transformFile(fileName, getOptions(module), function (err, result) {
            if (!err) fs.writeFile(path.join(__dirname, '..', dest), result.code, done);
            else done(err);
        });
    };
}

async.parallel([
    buildFactory('common', 'dist/commonjs/router5.js'),
    buildFactory('umd', 'dist/umd/router5.js')
], function (err) {
    process.exit(err ? 1 : 0);
});
