import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import jade from 'gulp-jade';
import rename from 'gulp-rename';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack/config';
import config from './config.json'

/*
 * Common tasks
 */

gulp.task('replace-webpack-code', () => {
  const replaceTasks = [{
    from: './webpack/replace/JsonpMainTemplate.runtime.js',
    to: './node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: './webpack/replace/log-apply-result.js',
    to: './node_modules/webpack/hot/log-apply-result.js'
  }];
  replaceTasks.forEach(task => fs.writeFileSync(task.to, fs.readFileSync(task.from)));
});

/*
 * Build tasks
 */

gulp.task('config:build:extension', () => {
  gulp.src('./src/browser/extension/manifest.json.example')
  .pipe(replace('http://bridge-api-base', config.bridgeApiBase))
  .pipe(rename('manifest.json'))
  .pipe(gulp.dest('./build/extension'));

  gulp.src('./src/app/config/config.js.example')
  .pipe(replace('http://bridge-api-base', config.bridgeApiBase))
  .pipe(rename('config.js'))
  .pipe(gulp.dest('./src/app/config'));
});

gulp.task('webpack:build:extension', (callback) => {
  let myConfig = Object.create(webpackConfig);
  webpack(myConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({ colors: true }));
    callback();
  });
});

gulp.task('views:build:extension', () => {
  gulp.src([
    './src/browser/views/*.jade',
    '!./src/browser/views/devtools.jade'
  ])
  .pipe(jade({
    locals: { env: 'prod' }
  }))
  .pipe(gulp.dest('./build/extension'));
});

gulp.task('copy:build:extension', () => {
  gulp.src('./src/browser/extension/manifest.json').pipe(gulp.dest('./build/extension'));
  gulp.src('./src/assets/**/*').pipe(gulp.dest('./build/extension'));
});

gulp.task('build:extension', ['replace-webpack-code', 'config:build:extension', 'webpack:build:extension', 'views:build:extension', 'copy:build:extension']);
