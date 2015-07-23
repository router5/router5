var babel       = require('babel');
var path        = require('path');
var fs          = require('fs');
var async       = require('async');
var mkdirp      = require('mkdirp');
var argv        = require('yargs').argv;

var router5Version = require('../package.json').version;
var getOptions     = require('./babel-options');
var indexFile      = path.join(__dirname, '../modules/index.js');
var router5File    = path.join(__dirname, '../modules/Router5.js');
var transitionFile = path.join(__dirname, '../modules/transition.js');
var asyncFile      = path.join(__dirname, '../modules/async.js');
var constantsFile  = path.join(__dirname, '../modules/constants.js');

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
        transform(transitionFile),
        transform(asyncFile),
        transform(constantsFile)
    ], function (err, results) {
        if (err) console.log(err);
        // License
        var license = results[0].toString().trim().split('\n').map(function (line) {
            return ' * ' + line;
        }).join('\n');
        license = '/**\n * @license\n * @version ' + router5Version + '\n' + license + '\n */';

        var pathParserSrc = results[1].code.trim();
        var routeNodeSrc = results[2].code.trim();
        var router5Src = results[3].code.trim();
        var transitionSrc = results[4].code.trim();
        var asyncSrc = results[5].code.trim();
        var constantsSrc = results[6].code.trim();

        var bundledCode = pathParserSrc.replace(/("|')use strict("|');\n/g, '') +
            (constantsSrc + routeNodeSrc + asyncSrc + transitionSrc + router5Src)
                .replace(/("|')use strict("|');\n/g, '')
                .replace(/\nvar _createClass(?:.*)\n/, '')
                .replace(/\nfunction _classCallCheck(?:.*)\n/, '');

        bundledCode = bundledCode.split('\n').map(function (line) {
            return '    ' + line;
        }).join('\n');

        var globalHeader = '\n(function (window) {\n';
        var globalFooter = '\n}(window));\n';
        var globalExport = '\n\n' +
            '    window.RouteNode = RouteNode;\n' +
            '    window.Router5 = Router5;\n';

        var amdHeader = "\ndefine('router5', [], function () {\n";
        var amdFooter = '\n});\n';
        var amdExport = '\n\n    return {RouteNode: RouteNode, Router5: Router5};';

        var useStrict = "'use strict';\n";

        var globalCode = license + globalHeader + bundledCode + globalExport + globalFooter;
        var amdCode = license + amdHeader + bundledCode + amdExport + amdFooter;

        async.parallel([
            fs.writeFile.bind(fs, path.join(__dirname, '../dist/browser/router5.js'), globalCode),
            fs.writeFile.bind(fs, path.join(__dirname, '../dist/amd/router5.js'), amdCode)
        ], done)
    })
}

function exit(err) {
    if (err) console.log(err);
    process.exit(err ? 1 : 0);
}

if (argv.test) {
    async.series([
        mkdirp.bind(null, 'dist/test'),
        buildFactory('ignore', 'dist/test/router5.js',    router5File),
        buildFactory('ignore', 'dist/test/transition.js', transitionFile),
        buildFactory('ignore', 'dist/test/async.js',      asyncFile),
        buildFactory('ignore', 'dist/test/constants.js',  constantsFile)
    ], exit);
} else {
    async.parallel([
        buildFactory('common', 'dist/commonjs/index.js',      indexFile),
        buildFactory('common', 'dist/commonjs/router5.js',    router5File),
        buildFactory('common', 'dist/commonjs/transition.js', transitionFile),
        buildFactory('common', 'dist/commonjs/async.js',      asyncFile),
        buildFactory('common', 'dist/commonjs/constants.js',  constantsFile),

        buildFactory('umd',    'dist/umd/index.js',           indexFile),
        buildFactory('umd',    'dist/umd/router5.js',         router5File),
        buildFactory('umd',    'dist/umd/transition.js',      transitionFile),
        buildFactory('umd',    'dist/umd/async.js',           asyncFile),
        buildFactory('umd',    'dist/umd/constants.js',       constantsFile),

        buildBundle
    ], exit);
}
