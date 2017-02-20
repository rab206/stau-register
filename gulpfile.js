var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    uglify = require("gulp-uglify"),
    pump = require("pump");
 
// task
gulp.task('minify', function (cb) {
    pump([
          gulp.src('js/*.js'),
          uglify(),
          gulp.dest('public')
        ],
        cb
      );
});

gulp.task('default', ['minify'], function() {

    browserSync({
        files: 'public/**',
        port: 8082
    });

});

