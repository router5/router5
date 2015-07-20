var babel       = require('babel');
var path        = require('path');
var fs          = require('fs');
var async       = require('async');
var mkdirp      = require('mkdirp');
var argv        = require('yargs').argv;

var getOptions     = require('./babel-options');
var router5File    = path.join(__dirname, '../modules/Router5.js');
var transitionFile = path.join(__dirname, '../modules/Transition.js');

function buildFactory(module, dest, file) {
    return function buildCommonJsModuel(done) {
        babel.transformFile(file, getOptions(module), function (err, result) {
            if (!err) fs.writeFile(path.join(__dirname, '..', dest), result.code, done);
            else done(err);
        });
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

    var pathParser = path.join(__dirname, '../node_modules/route-node/node_modules/path-parser/modules/Path.js');
    var routeNode  = path.join(__dirname, '../node_modules/route-node/modules/RouteNode.js');

    async.parallel([
        fs.readFile.bind(fs, path.join(__dirname, '../LICENSE')),
        transform(pathParser),
        transform(routeNode),
        transform(router5File),
        transform(transitionFile)
    ], function (err, results) {
        console.log(err);
        // License
        var license = results[0].toString().trim().split('\n').map(function (line) {
            return ' * ' + line;
        }).join('\n');
        license = '/**\n * @license\n' + license + '\n */';

        var pathParserSrc = results[1].code.trim();
        var routeNodeSrc = results[2].code.trim();
        var router5Src = results[3].code.trim();
        var transitionSrc = results[4].code.trim();

        var classesSrc = pathParserSrc.replace(/("|')use strict("|');\n/g, '') +
            (routeNodeSrc + router5Src + transitionSrc)
                .replace(/("|')use strict("|');\n/g, '')
                .replace(/\nvar _createClass(?:.*)\n/, '')
                .replace(/\nfunction _classCallCheck(?:.*)\n/, '');

        var globalVars = '\n' +
            'window.RouteNode = RouteNode;\n' +
            'window.Router5 = Router5;\n';

        var code = license + '\n(function () {\n\'use strict\';\n' + classesSrc + '\n' + globalVars + '\n}());\n';

        fs.writeFile(path.join(__dirname, '../dist/browser/router5.js'), code, done);
    })
}

function exit(err) {
    if (err) console.log(err);
    process.exit(err ? 1 : 0);
}

if (argv.test) {
    async.series([
        mkdirp.bind(null, 'dist/test'),
        buildFactory('ignore', 'dist/test/router5.js', router5File),
        buildFactory('ignore', 'dist/test/transition.js', transitionFile)
    ], exit);
} else {
    async.parallel([
        buildFactory('common', 'dist/commonjs/router5.js', router5File),
        buildFactory('common', 'dist/commonjs/transition.js', transitionFile),
        buildFactory('umd',    'dist/umd/router5.js', router5File),
        buildFactory('umd',    'dist/umd/transition.js', transitionFile),
        buildBundle
    ], exit);
}
