import { default as WebpackMerge } from "webpack-merge";

import * as ReleaseBase from "./webpack.releasebase";

const config = WebpackMerge(ReleaseBase.makeReleaseBase(), {
  optimization: {
    concatenateModules: false,
    namedModules: true,
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: m => {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = m.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
});

export default config;
