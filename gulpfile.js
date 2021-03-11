const autoprefix = require('autoprefixer');
const browserSync = require('browser-sync');
const del = require('del');
const gulpStylelint = require('gulp-stylelint');
const cssnano = require('cssnano');
const modernizr = require('gulp-modernizr');
const optimizejs = require('gulp-optimize-js');
const pkg = require('./package.json');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('stylelint');
const svgmin = require('gulp-svgmin');
const ugliterse   = require('gulp-uglify-es').default;
const util = require('./gulp/util.js');
const { modernizrOptions } = require('./gulp/options.js');
const { src, dest, series, parallel, watch } = require('gulp');


// cleaning

function cleanAllTask(done) {
  'use strict';
  del.sync(['GENERATED', 'GENERATED-min', 'GENERATED-reports']);
  done();
}

function cleanCssTask(done) {
  'use strict';
  del.sync(['GENERATED/static/css']);
  done();
}

function cleanCssOwnTask(done) {
  'use strict';
  del.sync(['GENERATED/static/css/theme.*', 'GENERATED/static/css/webfonts.*', 'GENERATED/static/css/fontawesome.*']);
  done();
}

function cleanJsTask(done) {
  'use strict';
  del.sync(['GENERATED/static/js']);
  done();
}

function cleanJsOwnTask(done) {
  'use strict';
  del.sync([
    'GENERATED/static/js/theme.*',
    'GENERATED/static/js/searchtools.*',
    'GENERATED/static/js/doctools.*',
    'GENERATED/static/jsmaps/theme.*',
    'GENERATED/static/jsmaps/searchtools.*',
    'GENERATED/static/jsmaps/doctools.*',
     ]);
  done();
}


// copying

function cssCopyOwnTask() {
  'use strict';
  return src(['sass/theme.scss', 'sass/webfonts.scss', 'sass/fontawesome.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true,
      errLogToConsole: true
    }))
    .pipe(postcss([
      autoprefix({
        cascade: true,
        remove: true
      }),
      stylelint({
        fix: true,
        faillAfterError: false,
        reportOutputDir: 'GENERATED-reports/lint',
        configOverrides: {
          "rules": {
            "declaration-block-no-duplicate-properties": null,
          }
        },
        reporters: [
          {formatter: 'verbose', console: true},
          {formatter: 'json', save: 'report.json'},
        ]}),
      ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('GENERATED/static/css/'))
    ;
}

function copyFontsTask() {
  'use strict';
  return src(['node_modules/@fortawesome/fontawesome-free/webfonts/**/*'])
    .pipe(src(['fonts/**/*', '!**/*.txt']))
    .pipe(dest('GENERATED/static/fonts/'));
}

function copyHtmlTask(done) {
  'use strict';
  return src(['clickdummy/webroot/**/*'])
    .pipe(dest('GENERATED/'));
}

function copySvgTask(done) {
  'use strict';
  return src(['img/**/*.svg'])
    .pipe(svgmin())
    .pipe(dest('GENERATED/static/img/'));
}

function jsCopyOwnTask(done) {
  'use strict';
  return src(['js/**/*.js'])
    .pipe(optimizejs())
    .pipe(dest('GENERATED/static/js/'));
}

function copyVendorStuffTask(done) {
  'use strict';
  return src(['node_modules/gsap/dist/**/*'])
    .pipe(dest('GENERATED/static/vendor/gsap/dist/'));
}

function jsCopyVendorTask() {
  'use strict';
  return src(['node_modules/jquery/dist/jquery.js'])
    .pipe(src(['node_modules/popper.js/dist/umd/popper.js']))
    .pipe(src(['node_modules/bootstrap/dist/js/bootstrap.js']))
    .pipe(src(['node_modules/autocompleter/autocomplete.js']))
    .pipe(src(['node_modules/underscore/underscore.js']))
    .pipe(optimizejs())
    .pipe(dest('GENERATED/static/js'));
}

function jsCopyMinVendorTask() {
  'use strict';
  return src(['node_modules/jquery/dist/jquery.min.js'])
    .pipe(src(['node_modules/popper.js/dist/umd/popper.min.js']))
    .pipe(src(['node_modules/bootstrap/dist/js/bootstrap.min.js']))
    .pipe(src(['node_modules/autocompleter/autocomplete.min.js']))
    // .pipe(src(['node_modules/underscore/underscore.min.js']))
    .pipe(dest('GENERATED-min/static/js'));
}

// devault

function defaultTask(done) {
  'use strict';
  console.log("run: 'yarn gulp --simple-tasks' or 'yarn gulp -T'");
  done();
}

// css

function cssMinifyTask() {
  'use strict';
  return src(['GENERATED/static/css/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.min'}))
    .pipe(postcss([
      cssnano({
        discardComments: {
          removeAll: true
        }
      }),
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('GENERATED/static/css/'))
    ;
}

function cssMinifyOwnTask() {
  'use strict';
  return src([
    'GENERATED/static/css/theme.css',
    'GENERATED/static/css/webfonts.css',
    'GENERATED/static/css/fontawesome.css',
  ])
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.min'}))
    .pipe(postcss([
      cssnano({
        discardComments: {
          removeAll: true
        }
      }),
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('GENERATED/static/css/'))
    ;
}

function jsAddModernizrTask(done) {
  'use strict';
  return src(['js/**/*.js'])
    .pipe(modernizr(modernizrOptions))
    .pipe(dest('GENERATED/static/js/'));
}

function jsUglifyTask() {
  'use strict';
  return src(['GENERATED/static/js/**/*.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(ugliterse())
    .pipe(sourcemaps.write('../jsmaps'))
    .pipe(dest('GENERATED/static/js/'))
    ;
}

function jsUglifyOwnTask() {
  'use strict';
  return src(['GENERATED/static/js/theme.js', 'GENERATED/static/js/doctools.js', 'GENERATED/static/js/searchtools.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(ugliterse())
    .pipe(sourcemaps.write('../jsmaps'))
    .pipe(dest('GENERATED/static/js/'))
    ;
}

function uglifyOwnTask() {
  'use strict';
  return src(['GENERATED/static/js/theme.js', 'GENERATED/static/js/doctools.js', 'GENERATED/static/js/searchtools.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(ugliterse())
    .pipe(sourcemaps.write('../jsmaps'))
    .pipe(dest('GENERATED/static/js/'))
    ;
}

function startServer(done) {
  'use strict';
  // https://browsersync.io/docs/options
  browserSync.init({
    server: {
      baseDir: 'GENERATED/'
    }
  });
  done();
}

function reloadBrowser(done) {
  'use strict';
  browserSync.reload();
  done();
}

function watchSource(done) {
  'use strict';
  watch('clickdummy/webroot', series(exports.copyHtml, reloadBrowser));
  watch('sass', series(exports.cssBuildOwn, reloadBrowser));
  watch('js' , series(exports.jsBuildOwn, reloadBrowser));
  done();
}

// 1st level solo

exports.default = defaultTask;
exports.decodePackageJson = util.decodePackageJsonTask;


exports.cleanCss = cleanCssTask;
exports.cleanCssOwn = cleanCssOwnTask;
exports.cleanJs = cleanJsTask;
exports.cleanJsOwn = cleanJsOwnTask;

exports.copyFonts = copyFontsTask;
exports.copyHtml = copyHtmlTask;
exports.copySvg = copySvgTask;
exports.copyVendorStuff = copyVendorStuffTask;

exports.cssCopyOwn = cssCopyOwnTask;
exports.cssMinify = cssMinifyTask;

exports.jsAddModernizr = jsAddModernizrTask;
exports.jsCopyMinVendor = jsCopyMinVendorTask;
exports.jsCopyOwn = jsCopyOwnTask;
exports.jsCopyVendor = jsCopyVendorTask;
exports.jsCopyVendorAll = parallel(jsCopyVendorTask, jsCopyMinVendorTask);
exports.jsUglify = jsUglifyTask;
exports.jsUglifyOwn = jsUglifyOwnTask;



// 2nd level combined

exports.CLEAN_ALL = cleanAllTask;

exports.CSS_BUILD_ALL = series(
  exports.cleanCss,
  exports.cssCopyOwn,
  exports.cssMinify,
);

exports.JS_BUILD_ALL = series(
  exports.cleanJs,
  parallel(
    exports.jsAddModernizr,
    exports.jsCopyOwn,
    exports.jsCopyVendorAll,
  ),
 exports.jsUglify
);

// 3nd level combined

exports.frontend = series(
  exports.CLEAN_ALL,
  parallel(
    exports.CSS_BUILD_ALL,
    exports.JS_BUILD_ALL,
    exports.copyFonts,
    exports.copyHtml,
    exports.copySvg,
    exports.copyVendorStuff,
  ),
);
exports.watch = series(exports.frontend, startServer, watchSource);

exports.cssBuildOwn = series(cleanCssOwnTask, cssCopyOwnTask, cssMinifyOwnTask);
exports.jsBuildOwn = series(cleanJsOwnTask, jsCopyOwnTask, uglifyOwnTask);

