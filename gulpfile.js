//定义依赖和插件
var gulp = require('gulp'),
    // concat = require('gulp-concat'),
    // rename = require('gulp-rename'),
    // clean = require('gulp-clean'),
    connect = require('gulp-connect'),//livereload
    browserify = require('gulp-browserify');

var jsSrc = 'src/js/**/*.js';
var jsDist = 'dist/js';

var cssSrc = 'src/css/**/*.css';
var cssDist = 'dist/css';


var htmlSrc = 'src/index.html';
var htmlDist = 'dist';

//定义名为js的任务
gulp.task('js', function () {

    gulp.src('src/js/index.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        // .pipe(concat('main.js'))
        // .pipe(gulp.dest(jsDist))
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(jsDist))
        .pipe(connect.reload())

});

//定义html任务
gulp.task('html', function () {

    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDist))
        .pipe(connect.reload());

});

gulp.task('css', function () {

    gulp.src(cssSrc)
        .pipe(gulp.dest(cssDist))
        .pipe(connect.reload());

});

//定义livereload任务
gulp.task('connect', function () {
    connect.server({
        livereload: true
    });
});


//定义看守任务
gulp.task('watch', function () {

    gulp.watch(htmlSrc, ['html']);

    gulp.watch(cssSrc, ['css']);

    gulp.watch(jsSrc, ['js']);

});

gulp.task('default', function () {
    // return gulp.src('dist', {read: false})
    //     .pipe(clean());
});

//定义默认任务
gulp.task('default', [ 'js', 'html', 'css', 'watch', 'connect']);