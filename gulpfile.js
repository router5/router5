var argv = require('yargs').argv;
var path = require('path');
var del = require('rimraf');

var app = path.join(__dirname, 'apps/' + argv.app);

var watchify   = require('watchify');
var browserify = require('browserify');
var gulp       = require('gulp');
var livereload = require('gulp-livereload');
var source     = require('vinyl-source-buffer');
var rename     = require('gulp-rename');

function getBundler(app, watch) {
    var b = browserify({
            paths: ['node_modules', 'apps'],
            extensions: ['js', 'jsx'],
            fullPaths: watch || false,
            cache: {},
            packageCache: {},
            entries: []
        })
        .transform('babelify')
        .transform({global: true}, 'browserify-shim')
        .exclude('react')
        .add(app + '/main.js');

    return watch ? watchify(b) : b;
}

function bundle(app, bundler, reload) {
    return bundler
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(app + '/build/scripts'));
}

function watch(app) {
    var b = getBundler(app, true)
    b.on('update', function () {
        bundle(b).pipe(livereload());
    });
    b.on('log', console.log.bind(console));

    return bundle(app, b, true);
}

function cleanApp(done) {
    del(path.join(app, 'build'), done);
}

function buildApp() {
    return bundle(app, getBundler(app, false), false);
}

function copyIndex() {
    return gulp.src(path.join(app, 'static/index.html'), {buffered: false})
        .pipe(gulp.dest(path.join(app, 'build')));
}

function copyLibs() {
    return gulp.src(path.join(__dirname, 'node_modules/react/dist/react.js'), {buffered: false})
        .pipe(gulp.dest(path.join(app, 'build/scripts')));
}

gulp.task('build', gulp.series(cleanApp, gulp.parallel(buildApp, copyIndex, copyLibs)));

