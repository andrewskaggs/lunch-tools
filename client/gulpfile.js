var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', ['browser-sync', 'watch']);

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('watch', function () {
  gulp.watch("app/**").on("change", browserSync.reload);
});
