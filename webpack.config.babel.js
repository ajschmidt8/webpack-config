import { resolve } from "path";
import webpack from "webpack";
import exec from "script-loader";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    context: resolve(__dirname, "src"),
    entry: "./main.js",
    output: {
      path: resolve(__dirname, "dist"),
      filename: "bundle-[hash].js"
    },
    devServer: {
      contentBase: "src",
      port: 9000,
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          loader: ExtractTextPlugin.extract({
            fallback: { loader: "style-loader" },
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1
                }
              },
              { loader: "postcss-loader" },
              {
                loader: "sass-loader"
              }
            ]
          })
        },
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        {
          test: /\.exec\.js$/,
          use: ["script-loader"]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name]-[hash].[ext]"
              }
            },
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true
              }
            }
          ]
        },
        { test: /\.html$/, loader: "html-loader" }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "index.html",
        minify: {
          removeComments: true,
          collapseWhitespace: true
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new UglifyJsPlugin({
        uglifyOptions: {
          keep_fnames: true
        }
      }),
      new ExtractTextPlugin({ filename: "styles-[hash].css", disable: isDev })
    ]
  };
};
