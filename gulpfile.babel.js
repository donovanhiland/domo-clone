import gulp from 'gulp';
import concat from 'gulp-concat';
import annotate from 'gulp-ng-annotate';
import plumber from 'gulp-plumber';
import uglify from 'gulp-uglify';
import watch from 'gulp-watch';
import sass from 'gulp-sass';
import path from 'path';
import babel from 'gulp-babel'

const paths = {
  jsSource: ['./public/app/**/*.js', '!/public/bundle.js'],
  serverSource: ['./server/es6-index.js'],
  sassSource: ['./public/assets/styles/**/*.scss']

};

// gulp.task('js', () =>  {
//   return gulp.src(paths.jsSource)
//   .pipe(plumber())
//   .pipe(babel({
//     presets: ["es2015"]
//   }))
//   .pipe(concat('bundle.js'))
//   .pipe(annotate())
//   .pipe(gulp.dest('./public'));
// });


// gulp.task('server', () => {
//   return gulp.src(paths.serverSource)
//   .pipe(plumber())
//   .pipe(babel({
//     presets: ["es2015"]
//   }))
//   .pipe(gulp.dest('./server/index.js'))
// })

gulp.task('styles', () => {
  return gulp.src(paths.sassSource)
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./public/assets/styles'));
});

gulp.task('watch', () =>  {
  // gulp.watch(paths.jsSource, ['js']);
  gulp.watch(paths.sassSource, ['styles']);
});

gulp.task('default', ['watch', /*'js',*/ 'styles']);
