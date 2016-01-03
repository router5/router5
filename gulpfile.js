var gulp         = require('gulp');
var babel        = require('gulp-babel');
var runSequence  = require('run-sequence');
var del          = require('del');

function buildCjs() {
    return gulp
        .src('modules/*.js', {base: 'modules'})
        .pipe(babel())
        .pipe(gulp.dest('dist/commonjs'));
};

gulp.task('clean', function() {
    return del('dist');
});

gulp.task('buildCommonJs', buildCjs);

gulp.task('build', function() {
    runSequence('clean', 'buildCommonJs');
});
