var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['serve']);

gulp.task('js', function () {
  return gulp.src('public/js/**/*.js')
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js'));
});

gulp.task('css', function () {
  return gulp.src('public/css/**/*.css')
    .pipe(concatCss('all.css'))
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('serve', ['js', 'css'], function () {
  nodemon({
    script: 'bin/www',
    ext: 'ejs js css',
    ignore: ['./public/js/all.js'],
    tasks: ['js', 'css']
  });
});
