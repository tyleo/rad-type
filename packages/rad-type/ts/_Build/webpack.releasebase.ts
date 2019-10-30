import { default as MiniCssExtractPlugin } from "mini-css-extract-plugin";
import * as Webpack from "webpack";
import { default as WebpackMerge } from "webpack-merge";

import * as Common from "./webpack.common";

export const makeReleaseBase = (
  defines?: Common.IDefines,
): Webpack.Configuration =>
  WebpackMerge(Common.makeCommon(defines), {
    mode: "production",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  });
