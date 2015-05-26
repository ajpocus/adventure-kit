var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var concatCss = require('gulp-concat-css');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['serve']);

gulp.task('js', function () {
  var b = browserify({
    entries: 'public/js/app.js',
    debug: true,
    transform: [babelify]
  });

  return b.bundle()
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify())
    //.on('error', gutil.log)
    //.pipe(sourcemaps.write('./public/dist/js/'))
    .pipe(gulp.dest('public/dist/js/'));
});

gulp.task('css', function () {
  return gulp.src('public/css/**/*.css')
    .pipe(concatCss('all.css'))
    .pipe(gulp.dest('public/dist/css/'));
});

gulp.task('serve', ['js', 'css'], function () {
  nodemon({
    script: 'bin/www',
    ext: 'ejs js css',
    ignore: ['./public/js/all.js'],
    tasks: ['js', 'css']
  });
});
