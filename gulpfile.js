var gulp = require('gulp'),
	watch = require('gulp-watch'),
	connect = require('gulp-connect'),
	linvereload = require('gulp-livereload'),
	prefixer = require('gulp-autoprefixer'),
	rigger = require('gulp-rigger'),
	cssnano = require('gulp-cssnano'),
	less = require('gulp-less'),
	rimraf = require('rimraf'),
	rename = require('gulp-rename'),
	spriteCreator = require('gulp.spritesmith'),
	notify = require("gulp-notify"),
	imagemin = require('gulp-imagemin');



gulp.task('sprite', function () {
	gulp.src('src/img/icons/*.png')
		.pipe(spriteCreator({
			imgName: 'build/img/sprite.png',
			cssName: 'src/less/imports/sprite.less',
			cssFormat: 'less',
			algorithm: 'binary-tree',
			padding: 20
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('css', function () {
	gulp.src('src/less/style.less') // Выберем наш style.less
		.pipe(less()) // Скомпилируем
		.pipe(prefixer()) // Добавим вендорные префиксы
		.pipe(gulp.dest('build/css/'))
		.pipe(rename('minify.css'))
		.pipe(cssnano({
			zindex: false
		})) // Сожмем
		.pipe(gulp.dest('build/css/'))
		.pipe(connect.reload()); // Переместим в build
});

gulp.task('html', function () {
	gulp.src('src/**/*.html') // Выберем файлы по нужному пути
		.pipe(rigger()) // Прогоним через rigger
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
	// Переместим их в папку build
});

gulp.task('reset', function () {
	gulp.src('src/less/reset.css')
		.pipe(gulp.dest('build/css/'))
});

gulp.task('image', function () {
	gulp.src('src/img/**/*.*') // Выберем наши картинки
		.pipe(imagemin({ // Сожмем их
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			interlaced: true
		}))
		.pipe(gulp.dest('build/img/'))
		.pipe(connect.reload());
	// Переместим в build
});

gulp.task('fonts', function () {
	gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts/'))
		.pipe(connect.reload());
	// Переместим шрифты в build
});

gulp.task('clean', function (cb) {
	rimraf('build/', cb);
});

gulp.task('server', function(){
		connect.server({
			root : 'build',
			livereload: true
		});
});

gulp.task('build', [
    'html',
    'css',
    'css',
    'fonts',
    'image',
    'sprite',
]);

gulp.task('watch', function () {
	gulp.start('html', 'css', 'image', 'fonts', 'sprite', 'server');

	gulp.watch(['src/**/*.html'], function (event, cb) {
		gulp.start('html');
	});
	gulp.watch(['src/less/style.less'], function (event, cb) {
		gulp.start('css');
	});
	gulp.watch(['src/img/**/*.*'], function (event, cb) {
		gulp.start('image');
	});
	gulp.watch(['src/fonts/'], function (event, cb) {
		gulp.start('fonts');
	});
	gulp.watch(['src/img/icons/**/*.png'], function (event, cb) {
		gulp.start('sprite:build');
	});
});










