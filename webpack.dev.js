const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");
var hotMiddlewareScript = "webpack-hot-middleware/client";

let clientConfig = {
  entry: {
    main: ["react-hot-loader/patch", hotMiddlewareScript, "./src/index.jsx"],
  },
  mode: "development",
  output: { publicPath: "/" },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    hot: true,
  },
  plugins: [
    // OccurrenceOrderPlugin is needed for webpack 1.x only
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

let serverConfig = {
  entry: {
    server: ["babel-polyfill", "./src/server/server.js"],
  },
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    hot: true,
  },
  plugins: [],
};

module.exports = [
  merge(common.clientConfig, clientConfig),
  merge(common.serverConfig, serverConfig),
];
