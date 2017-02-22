var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  pump = require("pump"),
  $ = require('gulp-load-plugins')({
    lazy: true
  });

// task
gulp.task('minify', function(cb) {
  log('Minifying javascript');
  pump([
      gulp.src('js/*.js'),
      $.sourcemaps.init(),
      $.babel({
        presets: ['babili']
      }),
      $.sourcemaps.write('.'),
      // $.concat('index.js'),
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



function log(message) {
  $.util.log($.util.colors.blue(message));
}
