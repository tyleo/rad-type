import * as WebpackMerge from "webpack-merge";

import * as Webpack_ from "Webpack_";

export const Dev = (packageRoot: string) =>
  WebpackMerge(Webpack_.DevBase(packageRoot), {
    output: {
      libraryTarget: "commonjs2",
    },
  });
