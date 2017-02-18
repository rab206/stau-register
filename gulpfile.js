var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('default', function() {

    browserSync({
        files: 'index.html',
        port: 8082
    });

});

