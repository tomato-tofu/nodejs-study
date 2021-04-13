const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    "js/app": "./src/app.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "[name]-[hash:6].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
      inject: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: "./public/*.svg", to: path.join(__dirname, "./dist/logo.svg") },
        { from: "./public/lib", to: path.join(__dirname, "./dist/lib") },
      ],
    }),
    // 模块热替换功能
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   linkType: "text/css",
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
      {
        test: /\.less$/,
        use: [
          // MiniCssExtractPlugin.loader,
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },

          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.art$/,
        loader: "art-template-loader",
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "./dist"), // 告诉服务器从哪个目录中提供内容
    port: 8080, // 配置端口号
    host: "0.0.0.0", // 配置host，推荐写成0.0.0.0
    // proxyTable: {
    //   "/api": {
    //     target: "",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/api": "",
    //     },
    //   },
    // },
    proxy: {
      "/api": {
        target: "http://localhost:3000/api",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
