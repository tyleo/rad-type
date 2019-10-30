import * as Path from "path";

import * as Webpack from "webpack";
import * as WebpackMerge from "webpack-merge";

import * as Webpack_ from "Webpack_";

export const DevBase = (
  packageRoot: string,
  entry?: string | string[] | Webpack.Entry | Webpack.EntryFunc,
) =>
  WebpackMerge(Webpack_.Common(packageRoot, entry), {
    devtool: "source-map",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "source-map-loader",
          enforce: "pre",
        },
      ],
    },
    output: {
      path: Path.resolve(packageRoot, "target/dev"),
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  });
