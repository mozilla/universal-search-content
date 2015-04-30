var _ = require('underscore');
var util = require('util');
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var awspublish = require('gulp-awspublish');

var localConfig;
try {
  localConfig = require('./gulpconfig');
} catch (e) {
  localConfig = {};
  // TODO: Just bail out and exit?
  console.error('Failed to load local config:', e);
}

var CONFIG = _.defaults(localConfig, {
  aws: {},

  layers: {

    // Base universal search iframe content
    base: {
      html: { src: './src/**/*.html', dest: './dist' },
      scripts: { src: './src/scripts/**/*.js', dest: './dist/scripts'},
      styles: { src: './src/styles/**/*.css', dest: './dist/styles'},
      sass: { src: './src/styles/**/*.scss', dest: './dist/styles'},
      images: { src: './src/images/**/*', dest: './dist/images' }
    },

    // Harness layer for local dev & hacking
    harness: {
      html: { src: './src-harness/**/*.html', dest: './dist-harness' },
      scripts: { src: './src-harness/scripts/**/*.js', dest: './dist-harness/scripts'},
      styles: { src: './src-harness/styles/**/*.css', dest: './dist-harness/styles'},
      sass: { src: './src-harness/styles/**/*.scss', dest: './dist-harness/styles'},
      images: { src: './src-harness/images/**/*', dest: './dist-harness/images' }
    }

  }
});

var layerNames = Object.keys(CONFIG.layers);

gulp.task('default', ['server']);

// Set up server to build & watch & serve up all layers
gulp.task('server', ['build', 'watch'], function () {
  connect.server({
    port: 9000,
    livereload: true,
    // Serve up the HTML roots of all layers
    root: layerNames.map(function (layer) {
      return CONFIG.layers[layer].html.dest;
    }),
  });
});

// Set up umbrella tasks for each layer.
['build', 'watch', 'deploy'].forEach(function (taskName) {
  gulp.task(taskName, layerNames.map(function (layer) {
    return taskName + ':' + layer;
  }));
});

// Set up build & watch for each of the layers
layerNames.forEach(function (layer) {

  var subtasks = Object.keys(CONFIG.layers[layer]);
  var buildPrefix = 'build:' + layer;

  // Create the build:{layer} task
  gulp.task(buildPrefix, subtasks.map(function (subtask) {
    return buildPrefix + ':' + subtask;
  }));

  // Create the watch:{layer} task
  gulp.task('watch:' + layer, function () {
    subtasks.forEach(function (subtask) {
      gulp.watch(CONFIG.layers[layer][subtask].src,
                 [buildPrefix + ':' + subtask]);
    });
  });

  // Create build:{layer}:{subtask} file copy tasks
  ['html', 'scripts', 'styles', 'images'].forEach(function (subtask) {
    gulp.task(buildPrefix + ':' + subtask, function () {
      return gulp.src(CONFIG.layers[layer][subtask].src)
        .pipe(gulp.dest(CONFIG.layers[layer][subtask].dest))
        .pipe(connect.reload());
    });
  });

  // TODO: concat / minify for scripts?
  // TODO: compress for images?
  // TODO: drop styles task in favor of all *.scss?

  // Process *.scss styles with Sass
  gulp.task(buildPrefix + ':sass', function () {
    return gulp.src(CONFIG.layers[layer].sass.src)
      .pipe(sass())
      .pipe(gulp.dest(CONFIG.layers[layer].sass.dest))
      .pipe(connect.reload());
  });

  gulp.task('deploy:' + layer, [buildPrefix], function () {
    var publisher = awspublish.create(CONFIG.aws);
    var headers = {
      // 'Cache-Control': 'max-age=315360000, no-transform, public'
    };
    return gulp.src(CONFIG.layers[layer].html.dest + '/**')
      .pipe(publisher.publish(headers))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
  });

});
