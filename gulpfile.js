var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gulpImgResize = require('gulp-image-resize');
var cp = require('child_process');
var merge2 = require('merge2');
var del = require('del');

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

// browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./_site/"
      }
  });
});

// build jekyll
gulp.task('build:jekyll', function(done){
  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' })
    .on('close', done);
});

// build jekyll
gulp.task('rebuild:jekyll',['build:jekyll'] , function(){
  browserSync.reload();
});

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
});
