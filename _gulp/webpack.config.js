const path = require("path");
const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "";
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const mode = {
  dev: require("./webpack.dev.js"),
  prod: require("./webpack.prod.js"),
};

// 開発(true) or 本番(false)
const DEBUG = !env || (env && env === "development") ? true : false;

const config = {
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    index: "../_assets/js/index.js",
    // : "../_assets/js/.js",
    // : "../_assets/js/.js",
    // : "../_assets/js/.js",
    // : "../_assets/js/.js",
    // : "../_assets/js/.js",
    // : "../_assets/js/.js",
    // : "../_assets/js/.js",
  },
  // babel
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        //node_moduluesの中身にあるjsファイルはbabelを通さない
        exclude: /node_modules/,
        use: [
          {
            // Babel を利用する
            loader: "babel-loader",
            // Babel のオプションを指定する
            options: {
              presets: [
                [
                  // プリセットを指定することで、ES2020 を ES5 に変換
                  "@babel/preset-env",
                  {
                    targets: { ie: "11" },
                    //core-jsの設定 設定可能なキー：false(default) / entry / usage
                    //usage ⇒必要なpolifillだけをインストール
                    //@babel/preset-envについては以下を参考にするといい
                    // https://zenn.dev/sa2knight/articles/67f6f5cc4ed5e26e391c
                    useBuiltIns: "entry",
                    corejs: 3, //corejsのバージョン
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        // 拡張子 .css の場合
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: { url: false },
          },
        ],
        sideEffects: true, // production modeでもswiper-bundle.cssが使えるよう
      },
    ],
  },
  // ファイルの出力設定
  output: {
    // 出力ファイル名
    filename: "[name].js",
  },
  resolve: {
    alias: {
      /**
       * ★__dirname：
       * このファイル（webpack.config.js）がある場所までの絶対パス
       * 例）C:\\hoge\\fuga\\_gulp
       * @modulesは最終的にC:\\hoge\\fuga\\_gulp\\node_modulesになる
       */
      "@modules": path.resolve(__dirname, "node_modules"),
    },
  },
};

module.exports = DEBUG ? merge(config, mode.dev) : merge(config, mode.prod);
