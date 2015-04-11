var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');

var paths = {
    buildDir: 'build/',
    distDir:  '../server/client/'
};

gulp.task('default', ['clean', 'deploy', 'browser-sync', 'watch']);

gulp.task('clean', function() {
    del.sync([paths.buildDir, paths.distDir], { force: true });
});

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
