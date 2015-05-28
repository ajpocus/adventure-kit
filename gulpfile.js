var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var assign = require('object-assign');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var concatCss = require('gulp-concat-css');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['serve']);

var customOpts = {
  entries: ['public/js/app.js'],
  debug: true
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));
b.transform(babelify);

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
    .on('error', gutil.log)
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify())
    .pipe(sourcemaps.write('./public/dist/js/'))
    .pipe(gulp.dest('public/dist/js/'));
}

gulp.task('css', function () {
  return gulp.src('public/css/**/*.css')
    .pipe(concatCss('all.css'))
    .pipe(gulp.dest('public/dist/css/'));
});

gulp.task('serve', ['js', 'css'], function () {
  nodemon({
    script: 'bin/www',
    ignore: ['./public/js/all.js'],
    tasks: ['css']
  });
});
