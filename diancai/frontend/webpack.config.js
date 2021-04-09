const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    "js/app": "./src/app.js",
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
  ],
  module: {
    rules: [
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
  },
};
