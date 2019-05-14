/*jslint node: true, for */

'use strict';

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    cssCompressor = require('gulp-csso'),
    jsCompressor = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    reload = browserSync.reload,
    pipeline = require('readable-stream').pipeline,
    browserChoice = 'default';

const JS_DEMO_FILES = [
    // libs
    './node_modules/basiclightbox/dist/basicLightbox.min.js',
    './demo/js/app.js',
    // custom
];


gulp.task('build:demo:scss', function () {
    return gulp.src('./demo/styles/scss/style.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 10
        }).on('error', sass.logError))
        .pipe(cssCompressor({
            restructure: false,
        }))
        .pipe(gulp.dest('demo/styles'));
});

gulp.task('build:demo:es6', function () {
    return pipeline(
        gulp.src(JS_DEMO_FILES),
        concat('app.min.js'),
        babel({
            presets: ['@babel/env']
        }),
        jsCompressor(),
        gulp.dest('demo/js')
    );
});

gulp.task('serve:demo', ['build:demo:scss', 'build:demo:es6'], function () {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 100,
        browser: browserChoice,
        server: {
            baseDir: './'
        }
    });

    gulp.watch('./index.html').on('change', reload);
    gulp.watch('./demo/js/app.js', ['build:demo:es6'])
        .on('change', reload);
    gulp.watch('./demo/styles/scss/**/*', ['build:demo:scss'])
        .on('change', reload);
});

gulp.task('default', ['serve:demo']);