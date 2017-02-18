var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('default', function() {

    browserSync({
        files: 'public/**',
        port: 8082
    });

});

