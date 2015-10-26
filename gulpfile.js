var gulp         = require('gulp');
var babel        = require('gulp-babel');
var runSequence  = require('run-sequence');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var del          = require('del');

var files = [
    'modules/*.js'
];

function build(modules, dest) {
    return function() {
        return gulp
            .src(files, {base: 'modules'})
            .pipe(babel({modules: modules}))
            .pipe(gulp.dest(dest));
    };
}

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('buildCommonJs', build('common', 'dist/commonjs'));
gulp.task('buildUmd',      build('umd', 'dist/umd'));

gulp.task('build', function() {
    runSequence('clean', ['buildCommonJs', 'buildUmd']);
});
