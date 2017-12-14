var browserSync   = require('browser-sync').create();
var cp            = require('child_process');
var del           = require('del');
var gulp          = require('gulp');
var gulpImgResize = require('gulp-image-resize');
var merge2        = require('merge2');
var sass          = require('gulp-sass');
var postcss       = require('gulp-postcss');
var autoprefixer  = require('autoprefixer');
var cssnano       = require('cssnano');
var rename        = require('gulp-rename');
var sourcemaps    = require('gulp-sourcemaps');
var uglify        = require('gulp-uglify');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

// -------------------------------------
// config
// -------------------------------------

// image config
var imgConfig = [
  {
    src: './assets/img/works/**/*',
    dist: './_site/assets/img/works/',
    params: {
      width : 1500,
      crop : false,
      upscale : false,
      imageMagick: true
    }
  },
  {
    src: './assets/img/works/**/*',
    dist: './_site/assets/img/works/',
    params: {
      width : 1024,
      crop : false,
      upscale : false,
      imageMagick: true
    }
  },
  {
    src: './assets/img/works/**/*',
    dist: './_site/assets/img/works/',
    params: {
      width : 800,
      crop : false,
      upscale : false,
      imageMagick: true
    }
  }
]

// -------------------------------------
// browsersync
// -------------------------------------

// browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./_site/"
      }
  });
});


// -------------------------------------
// images
// -------------------------------------

// delete thumbnails
/**
 * - create empty array
 * - loop through config array and push "src" into empty array
 * - pass the final array to del to delete files
 */
gulp.task('images:thumbs:delete', function() {

  // empty array
  const dirstodelete = [];

  // push src in dirstodelete array
  imgConfig.map(function(transform){

    if (dirstodelete.includes(transform.dist) === false)
    {
      dirstodelete.push(transform.dist);
    }

  });

  // log it
  del(dirstodelete);
});


// create thumbs
gulp.task('images:thumbs', ['images:thumbs:delete'], function() {

  // build stream array
  const streams = [];

  // loop through config and create streams
  imgConfig.map(function(transform){

    streams.push(
      gulp.src(transform.src)
      .pipe(gulpImgResize({
        width : transform.params.width,
        crop : transform.params.crop,
        upscale : transform.params.upscale,
        imageMagick: transform.params.imageMagick
      }))
      .pipe(gulp.dest(transform.dist + "_" + transform.params.width + "/"))
    );

  });

  // merge streams
  merge2(streams);

});

// -------------------------------------
// JS
// -------------------------------------
gulp.task('build:js', function(){
  return gulp.src('./assets/js/main.js')
    .pipe(webpackStream( webpackConfig ))
    .pipe(gulp.dest('./_site/assets/js/'))
    .pipe(rename( {suffix: '.min'} ))
    .pipe(uglify())
    .pipe(gulp.dest('./_site/assets/js/'))
    .pipe(browserSync.stream());
});


// -------------------------------------
// CSS
// -------------------------------------

// autoprefixer config in package.json (browserlist)
gulp.task('build:css', function(){
  return gulp.src('./assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass( {outputStyle: 'expanded'} ))
    .pipe(gulp.dest('./_site/assets/css/'))
    .pipe(rename( {suffix: '.min'} ))
    .pipe(postcss( [autoprefixer(), cssnano()] ))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./_site/assets/css/'))
    .pipe(browserSync.stream());
});

// -------------------------------------
// jekyll
// -------------------------------------

// build jekyll
gulp.task('build:jekyll', function(done){
  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' })
    .on('close', done);
});

// build jekyll
gulp.task('rebuild:jekyll',['build:jekyll'] , function(){
  browserSync.reload();
});


// -------------------------------------
// tasks
// -------------------------------------

gulp.task('build', ['build:jekyll', 'build:css', 'build:js', 'images:thumbs']);

// -------------------------------------
// watch
// -------------------------------------

// watch
gulp.task('watch', ['browser-sync'], function(){
  gulp.watch([
    '_data/**/*',
    '_includes/**/*',
    '_layouts/**/*',
    '_pages/**/*',
    '_posts/**/*',
    '_works/**/*',
    '_config.yaml'
  ], ['rebuild:jekyll']);
  gulp.watch(['assets/scss/**/*'], ['build:css']);
  gulp.watch(['assets/js/**/*'], ['build:js']);
});
