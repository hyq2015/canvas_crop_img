'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del =require('del');
var postcss =require('gulp-postcss');
var autoprefixer =require('autoprefixer');
var gulpCopy =require('gulp-copy');
var gulpConcat =require('gulp-concat');
sass.compiler = require('node-sass');

function styles() {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'))
}
function scripts() {
    return gulp.src(['./src/EventUtil.js', './src/Dom.js', './src/cropper.js'])
        .pipe(gulpConcat('cropper.min.js'))
        .pipe(uglify({
            compress: {
                drop_console: true
            }
        }))
        .pipe(gulp.dest('./dist/js'))
}

function staticFile() {
    return gulp.src('src/*.woff')
        .pipe(gulpCopy('./dist/css', {prefix: 1}))
}

function watch() {
    gulp.watch('./src/**/*.scss', styles);
    gulp.watch('./src/**/*.js', scripts);
}

function clean() {
    return del(['dist'])
}

var build = gulp.series(clean, gulp.parallel(styles, scripts, staticFile));
gulp.task('build', build);
gulp.task('default', build);
watch();
