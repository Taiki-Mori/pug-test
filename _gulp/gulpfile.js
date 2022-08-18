const gulp = require("gulp");
const del = require("del");
const changed = require("gulp-changed");

// 本番とテストの設定
const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "";

// 本番環境用設定
if (env === "production") {
  thisCssStyle = "compressed"; // css圧縮する
  // thisCssStyle = 'expanded'; // css圧縮しない

  thisCssMap = false; // css.mapを作成しない

  // thisJsBundle = false; // jsをbundleしない
  thisJsBundle = true; // jsをbundleする
}
// テスト環境用設定
else if (env === "development") {
  thisCssStyle = "expanded"; // css圧縮しない

  thisCssMap = true; // css.mapを作成する

  // thisJsBundle = false; // jsをbundleしない
  thisJsBundle = true; // jsをbundleする
}

//scss
const sass = require("gulp-dart-sass"); //Dart Sass はSass公式が推奨 @use構文などが使える
const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
const notify = require("gulp-notify"); // エラー発生時のアラート出力
const postcss = require("gulp-postcss"); // PostCSS利用
const autoprefixer = require("gulp-autoprefixer"); //ベンダープレフィックス自動付与
const gcmq = require("gulp-group-css-media-queries"); //メディアクエリをまとめる
const browserSync = require("browser-sync"); //ブラウザリロード

//webpack
const webpack = require("webpack");
const webpackStream = require("webpack-stream"); // gulpでwebpackを使うために必要なプラグイン
// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

//画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");

//pug
const pug = require("gulp-pug");
const htmlbeautify = require("gulp-html-beautify");
const fs = require("fs");

// 入出力するフォルダを指定
const srcBase = "../_static/src";
const assetsBase = "../_assets";
const distBase = "../_dist";

const srcPath = {
  scss: assetsBase + "/scss/**/*.scss",
  js: assetsBase + "/js/**/*.js",
  img: [assetsBase + "/img/**/*", "!" + assetsBase + "/img/svg/*.svg"],
  font: assetsBase + "/font/**/*",
  html: srcBase + "/**/*.html",
  php: srcBase + "/**/*.php",
  pug: assetsBase + "/pug/**/!(_)*.pug",
};

const watchPath = {
  pug: [assetsBase + "/pug/**/*.pug", assetsBase + "/pug/**/*.pug"],
};

const distPath = {
  css: distBase + "/css/",
  js: distBase + "/js/",
  img: distBase + "/img/",
  font: distBase + "/font/",
  html: distBase + "/",
  php: distBase + "/**/*.php",
  pug: distBase + "/",
};

/**
 * clean
 */
const clean = () => {
  return del(
    [
      distBase + "/**",
      "!" + distBase + "/*.php", //WP用
      "!" + distBase + "/style.css", //WP用
      "!" + distBase + "/template-parts/**", //WP用
      "!" + distBase + "/screenshot.png", //WP用
    ],
    {
      force: true,
    }
  );
};

//postcss-cssnext ブラウザ対応条件 prefix 自動付与
const TARGET_BROWSERS = [
  "last 2 versions",
  "ie >= 11",
  "iOS >= 7",
  "Android >= 4.4",
];

/**
 * sass
 *
 */

const cssSass = () => {
  return gulp
    .src(srcPath.scss, {
      sourcemaps: thisCssMap,
    })
    .pipe(
      //エラーが出ても処理を止めない
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>"),
      })
    )
    .pipe(
      sass({
        outputStyle: thisCssStyle,
        quietDeps: true,
      }).on("error", sass.logError)
    ) //指定できるキー nested expanded compact compressed
    .pipe(gcmq()) // メディアクエリを圧縮
    .pipe(autoprefixer(TARGET_BROWSERS))
    .pipe(
      gulp.dest(distPath.css, {
        sourcemaps: "./",
      })
    ) //コンパイル先
    .pipe(browserSync.stream())
    .pipe(
      notify({
        message: "Sassをコンパイルしました！",
        onLast: true,
      })
    );
};

/**
 * webpack
 * トランスパイルとバンドルを行う
 * 設定はwebpack.config.jsにて行う
 */
const jsBundle = () => {
  // bundleする
  if (thisJsBundle) {
    return webpackStream(webpackConfig, webpack).pipe(gulp.dest(distPath.js));
  }
  // bundleせずにコピーだけ
  else {
    return gulp.src(srcPath.js).pipe(gulp.dest(distPath.js));
  }
};

/**
 * 画像圧縮
 */
const imgImagemin = () => {
  return (
    gulp
      .src(srcPath.img)
      // .pipe(changed(distPath.img))
      .pipe(
        imagemin(
          [
            imageminMozjpeg({
              quality: 80,
            }),
            imageminPngquant(),
            imageminSvgo({
              plugins: [
                {
                  removeViewbox: false,
                },
              ],
            }),
          ],
          {
            verbose: true,
          }
        )
      )
      .pipe(gulp.dest(distPath.img))
  );
};

/**
 * 独自fontをsrc配下に読み込む際の対応
 */
const font = () => {
  return gulp.src(srcPath.font).pipe(gulp.dest(distPath.font));
};

/**
 * html
 */
const html = () => {
  return gulp.src(srcPath.html).pipe(gulp.dest(distPath.html));
};

/**
 * php
 */
const php = () => {
  return gulp.src(srcPath.php).pipe(gulp.dest(distPath.php));
};

/**
 * pug
 *
 */

const htmlPug = () => {
  return gulp
    .src(srcPath.pug)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>"),
      })
    )
    .pipe(pug({}))
    .pipe(
      htmlbeautify({
        indent_size: 2, //インデントサイズ
        indent_char: " ", // インデントに使う文字列。\tにするとタブでインデント
        max_preserve_newlines: 5, // 許容する連続改行数。0にすると改行を全て削除してコンパイル
        preserve_newlines: true, // コンパイル前のコードの改行を維持する。改行を無視して整形したいならfalseにする
        indent_inner_html: false, //// <head>と<body>をインデントする
        extra_liners: [], // 終了タグの前に改行を入れるタグ。配列で指定。<head>, <body>, <html>の前で改行したくない場合は[]を指定
      })
    )
    .pipe(gulp.dest(distPath.pug))
    .pipe(browserSync.stream())
    .pipe(
      notify({
        message: "HTMLをコンパイルしました！",
        onLast: true,
      })
    );
};

/**
 * ローカルサーバー立ち上げ
 */
const browserSyncStaticFunc = () => {
  browserSync.init(browserSyncStaticOption);
};

const browserSyncWPFunc = () => {
  browserSync.init(browserSyncWPOption);
};

const browserSyncStaticOption = {
  server: distBase,
};

const browserSyncWPOption = {
  /**
   * LOCALやMAMPなどを使う時は下記proxyとopenを使用
   *
   * proxy: 'http://localhost:80', // 80はMAMPのアドレスと同じにすること！
   * proxy: ".local", // Localと同じローカルサーバーを入力
   * open: "external",
   */

  //proxy: ".local",
  //open: "external",
};

/**
 * リロード
 */
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

/**
 *
 * ファイル監視 ファイルの変更を検知したら、browserSyncReloadでreloadメソッドを呼び出す
 * series 順番に実行
 * watch('監視するファイル',処理)
 */
const watchFiles = () => {
  gulp.watch(srcPath.scss, { usePolling: true }, gulp.series(cssSass, browserSyncReload));
  gulp.watch(srcPath.js, { usePolling: true }, gulp.series(jsBundle, browserSyncReload));
  gulp.watch(srcPath.img, { usePolling: true }, gulp.series(imgImagemin, browserSyncReload));
  gulp.watch(watchPath.pug, { usePolling: true }, gulp.series(htmlPug, browserSyncReload));
};

/**
 * seriesは「順番」に実行
 * parallelは並列で実行
 *
 * 一度cleanでdistフォルダ内を削除し、最新のものをdistする
 */
exports.default = gulp.series(
  clean,
  gulp.parallel(cssSass, jsBundle, imgImagemin, htmlPug),
  gulp.parallel(watchFiles, browserSyncStaticFunc)
);

exports.wordpress = gulp.series(
  clean,
  gulp.parallel(cssSass, jsBundle, imgImagemin),
  gulp.parallel(watchFiles, browserSyncWPFunc)
);

exports.build = gulp.series(clean, gulp.parallel(cssSass, jsBundle, imgImagemin, htmlPug));

exports.wpbuild = gulp.series(clean, gulp.parallel(cssSass, jsBundle, imgImagemin));
