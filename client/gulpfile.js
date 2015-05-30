var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
bower = require('gulp-bower');

var paths = {
    appDir: 'app/**',
    buildDir: 'build/',
    distDir:  '../server/client/',
    bowerDir: 'bower_components/'
};

gulp.task('default', ['clean', 'bower', 'deploy', 'browser-sync', 'watch']);

gulp.task('bower', function() { 
    return bower().pipe(gulp.dest(paths.distDir + paths.bowerDir)) ;
});

gulp.task('clean', function() {
    del.sync([paths.buildDir, paths.distDir], { force: true });
});

gulp.task('deploy', function() {
    gulp.src(paths.appDir)
    // Perform minification tasks, etc here
    .pipe(gulp.dest(paths.distDir));
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
    gulp.watch(paths.bowerDir, ['bower', 'reload']);
    gulp.watch(paths.appDir, ['deploy', 'reload']);
});
