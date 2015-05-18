var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['build', 'serve']);

gulp.task('build', function () {
  var b = browserify({
    entries: './public/js/app.js',
    debug: true,
    transform: [babelify]
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('serve', function () {
  nodemon({
    script: 'bin/www',
    ext: 'ejs js',
    ignore: ['./public/js/bundle.js'],
    tasks: ['build']
  });
});
