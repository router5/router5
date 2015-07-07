var babel       = require('babel');
var path        = require('path');
var fs          = require('fs');
var async       = require('async');
// var mkdirp      = require('mkdirp');

var fileNames    = [
    'index.js',
    'link-factory.js',
    'segment-mixin-factory.js'
];

function buildFactory(module, dest) {
    return function buildCommonJsModuel(done) {
        async.parallel(
            fileNames.map(function (fileName) {
                return async.waterfall.bind(async, [
                    babel.transformFile.bind(babel, path.join(__dirname, '../modules', fileName), {modules: module}),
                    function (result, done) {
                        fs.writeFile(path.join(__dirname, '..', dest, fileName), result.code, done);
                    }
                ])
            }),
            done
        );
    };
}

/**
 * Bower build
 *
 * - Flat concat all modules (router5, route-node, path-parser)
 * - Only one 'use strict', _createClass and _classCallCheck
 * - Global variables registration
 */
function buildBundle(done) {
    function transform(fileToTransform) {
        return function (done) {
            babel.transformFile(fileToTransform, {modules: 'ignore'}, done)
        }
    }

    var linkFactory   = path.join(__dirname, '../modules/link-factory.js');
    var mixinFactory  = path.join(__dirname, '../modules/segment-mixin-factory.js');

    async.parallel([
        fs.readFile.bind(fs, path.join(__dirname, '../LICENSE')),
        transform(linkFactory),
        transform(mixinFactory)
    ], function (err, results) {
        // License
        var license = results[0].toString().trim().split('\n').map(function (line) {
            return ' * ' + line;
        }).join('\n');
        license = '/**\n * @license\n' + license + '\n */';

        var source =  (results[1].code + results[2].code).replace(/("|')use strict("|');\n/g, '');

        var globalVars = '\n' +
            'window.linkFactory = linkFactory;\n' +
            'window.segmentMixinFactory = segmentMixinFactory;\n';

        var code = license + '\n(function () {\n\'use strict\';\n' + source + '\n' + globalVars + '\n}());\n';

        fs.writeFile(path.join(__dirname, '../dist/browser/router5-react.js'), code, done);
    });
}

async.parallel([
    buildFactory('common', 'dist/commonjs'),
    buildFactory('amd',    'dist/amd'),
    buildBundle
], function (err) {
    if (err) console.log(err);
    process.exit(err ? 1 : 0);
});
