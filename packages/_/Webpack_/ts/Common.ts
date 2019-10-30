import * as Path from "path";

import * as Webpack from "webpack";
import * as WebpackNodeExternals from "webpack-node-externals";

// We assume that packageBuildDir is nested in the target package. If we had a package called "Example", that dir could be somewhere like "/packages/Example/build".
export const Common = (
  packageRoot: string,
  entry: string | string[] | Webpack.Entry | Webpack.EntryFunc = {
    index: Path.resolve(packageRoot, "target/ts/index.js"),
  },
): Webpack.Configuration => ({
  entry,
  externals: [
    WebpackNodeExternals({
      modulesDir: Path.resolve(packageRoot, "node_modules"),
    }),
    WebpackNodeExternals({
      modulesDir: Path.resolve(__dirname, "../../../../../node_modules"),
    }),
  ],
  output: {
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js"],
  },
});
