var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    eslint = require('gulp-eslint'),
    gulpIf = require('gulp-if'),
    gutil = require('gulp-util'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch');

/* ---------------------/
  Development Processes
/  --------------------*/

function plumberLogEnd(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || 'Error running Gulp',
      message: 'Error: <%= error.message %>'
    })
  });
}

function isEslintFixed(file) {
  return file.eslint !== null && file.eslint.fixed;
}

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    tunnel: true,
    online: true
  });
});

gulp.task('eslint', function() {
  return gulp.src(['*.js', '!gulpfile.js'])
    .pipe(plumberLogEnd('Error Running eslint'))
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(gulpIf(isEslintFixed, gulp.dest('.')))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['browserSync', 'eslint'], function() {
  watch(['*.js', '!gulpfile.js'], function(event) {gulp.start('eslint');});
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('*.css', browserSync.reload);
});

/* ---------------------/
      Other Processes
/  --------------------*/

gulp.task('default', ['watch']);
