import { default as WebpackMerge } from "webpack-merge";

import * as Common from "./webpack.common";
import * as ReleaseBase from "./webpack.releasebase";

const config = WebpackMerge(ReleaseBase.makeReleaseBase(), {
  devtool: "source-map",
  optimization: {
    namedModules: true,
  },
  output: {
    path: Common.webpackRelative("release"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
      },
    ],
  },
});

export default config;
