((__Gulp, __Uglify) => {
    __Gulp.task('cjs', () => {
        return __Gulp.src(['./dist/*.js', './dist/*/*.y.js', './dist/*/*/*.y.js']).pipe(__Uglify({
            mangle: true
        })).pipe(__Gulp.dest('./dist'));
    });
})(require("gulp"), require("gulp-uglify"));
