var gulp = require('gulp');
var bs = require('browser-sync');
var ts = require('gulp-typescript');

gulp.task('typescript', function () {
	var project = ts.createProject('tsconfig.json');
	var result = project.src().pipe(ts(project));
	return result.js
		.pipe(gulp.dest('.'))
		.pipe(bs.reload({stream: true}));
});

gulp.task('browser-sync', function () {
	bs.init(null, {
		files: ['*.css', '*.html'],
		server: {
			baseDir: '.'
		}
	});
});

gulp.task('default', ['typescript', 'browser-sync'], function () {
	gulp.watch('*.ts', ['typescript']);
});
