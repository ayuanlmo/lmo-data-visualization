((__Gulp, __Uglify) => {
    const copy = require('gulp-copy');
    __Gulp.task('cjs', () => {
        return __Gulp.src(['dist/**/*.js'])
            .pipe(__Uglify({mangle: true}))
            .pipe(__Gulp.dest('./dist'));
    });
    return __Gulp.src('package.json')
        .pipe(copy('dist', {prefix: 1}));
})(require('gulp'), require('gulp-uglify'));
