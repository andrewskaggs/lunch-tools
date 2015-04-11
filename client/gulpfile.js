var gulp        = require('gulp');
var browserSync = require('browser-sync');

var paths = {
    buildDir: 'build/',
    distDir:  '../server/client/'
};

gulp.task('default', ['deploy', 'browser-sync', 'watch']);

gulp.task('deploy', function() {
    gulp.src('app/**')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('../server/client'));
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
    gulp.watch("app/**", ['deploy', 'reload']);
});
