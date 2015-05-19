var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['build', 'serve']);

gulp.task('build', function () {
  return gulp.src('public/js/**/*.js')
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('serve', ['build'], function () {
  nodemon({
    script: 'bin/www',
    ext: 'ejs js',
    ignore: ['./public/js/all.js'],
    tasks: ['build']
  });
});
