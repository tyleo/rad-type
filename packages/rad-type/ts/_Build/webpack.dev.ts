import { default as WebpackMerge } from "webpack-merge";
import * as WebpackDevServer from "webpack-dev-server";

import * as Common from "./webpack.common";

const config = WebpackMerge(Common.makeCommon(), {
  devServer: {
    historyApiFallback: true,
  } as WebpackDevServer.Configuration,
  devtool: "source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: Common.webpackRelative("dev"),
  },
});

export default config;
