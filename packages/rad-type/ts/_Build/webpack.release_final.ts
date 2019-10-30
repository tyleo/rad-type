import { default as WebpackMerge } from "webpack-merge";

import * as Common from "./webpack.common";
import * as ReleaseBase from "./webpack.releasebase";

const config = WebpackMerge(
  ReleaseBase.makeReleaseBase({
    SERVER_FLAVOR: JSON.stringify("AWS"),
  }),
  {
    output: {
      path: Common.webpackRelative("release_final"),
    },
  },
);

export default config;
