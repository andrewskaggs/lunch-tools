var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  del = require('del'),
  bower = require('gulp-bower'),
  sass = require('gulp-sass');

var paths = {
    app: 'app/**',
    build: 'build/',
    dist: '../server/public/',
    bower: 'bower_components/',
    sass: 'app/sass/',
    css: 'css',
    bootstrap: 'bower_components/bootstrap-sass/assets/stylesheets'
};

gulp.task('default', ['clean', 'bower', 'sass', 'deploy', 'browser-sync', 'watch']);

gulp.task('bower', function() { 
    return bower().pipe(gulp.dest(paths.dist + paths.bower)) ;
});

gulp.task('clean', function() {
    del.sync([paths.build, paths.dist], { force: true });
});

gulp.task('deploy', function() {
    gulp.src(paths.app)
    // Perform minification tasks, etc here
    .pipe(gulp.dest(paths.dist));
});

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('browser-sync', function() {
    browserSync({
      proxy: "localhost:3000",
      logConnections: true
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.app, ['bower', 'sass', 'deploy', 'reload']);
});

gulp.task('sass', function() {
    gulp.src('app/sass/**/*.scss')
      .pipe(sass({
            includePaths: [
                './app/sass',
                './bower_components/bootstrap-sass/assets/stylesheets'
             ]
         }))
      .pipe(gulp.dest(paths.dist + paths.css));
});
