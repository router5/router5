var gulp         = require('gulp');
var babel        = require('gulp-babel');
var runSequence  = require('run-sequence');
var bundle       = require('./scripts/bundle');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var del          = require('del');

var files = [
    'modules/index.js',
    'modules/logger.js',
    'modules/constants.js',
    'modules/async.js',
    'modules/transition.js',
    'modules/router5.js'
];

var globalWrapper = {
    header: '\n(function (window) {\n"use strict";\n\n',
    footer: '\n}(window));\n',
    export: '\n\n' +
            '    window.RouteNode = RouteNode;\n' +
            '    window.Router5 = Router5;\n'
}

var amdWrapper = {
    header: '\ndefine(\'router5\', [], function () {\n"use strict";\n\n',
    footer: '\n});\n',
    export: '\n\n    return {RouteNode: RouteNode, Router5: Router5};'
}

function build(modules, dest) {
    return function() {
        return gulp
            .src(files, {base: 'modules'})
            .pipe(babel({modules: modules, blacklist: ['strict']}))
            .pipe(gulp.dest(dest));
    };
}

function buildBundle(dest, wrapper) {
    return function() {
        return gulp
            .src([
                     'node_modules/route-node/node_modules/path-parser/modules/Path.js',
                     'node_modules/route-node/modules/RouteNode.js'
                 ].concat(files.slice(1))
             )
            .pipe(babel({modules: 'ignore', blacklist: ['strict']}))
            .pipe(bundle(dest, wrapper))
            .pipe(gulp.dest('dist'))
            .pipe(uglify())
            .pipe(rename(dest + '/router5.min.js'))
            .pipe(gulp.dest('dist'));
    };
}

gulp.task('clean', function() {
    return del(['dist', 'temp']);
});

gulp.task('buildCommonJs', build('common', 'dist/commonjs'));
gulp.task('buildUmd',      build('umd', 'dist/umd'));
gulp.task('buildTest',     build('ignore', 'temp/test'));

gulp.task('buildGlobal',   buildBundle('browser', globalWrapper));
gulp.task('buildAmd',      buildBundle('amd', amdWrapper));

gulp.task('build', function() {
    runSequence('clean', ['buildCommonJs', 'buildUmd', 'buildGlobal', 'buildAmd', 'buildTest']);
});
