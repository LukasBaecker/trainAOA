const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const RemovePlugin = require("remove-files-webpack-plugin");

let clientConfig = {
  name: "client",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  target: "web",
  node: {
    fs: "empty",
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              lessOptions: {
                // If you are using less-loader@5 please spread the lessOptions to options directly
                modifyVars: {},
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [require("autoprefixer")];
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|tif)$/,
        use: [
          { loader: "file-loader", options: { name: "/static/[name].[ext]" } },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new HtmlWebPackPlugin({
      template: "./src/html/index.ejs",
      filename: "./index.html",
      favicon: "./src/img/favicon.png",
      title: "trainAOA",
      excludeChunks: ["server"],
    }),
  ],
};

let serverConfig = {
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  target: "node",
  node: {
    fs: "empty",
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new RemovePlugin({
      before: {
        // expects what your output folder is `dist`.
        test: [
          {
            folder: "./dist",
            method: () => true,
          },
        ],
        exclude: ["./dist/static/layers"],
      },
    }),
  ],
};

module.exports = { clientConfig, serverConfig };
