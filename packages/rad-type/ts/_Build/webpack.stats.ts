// eslint-disable-next-line @typescript-eslint/no-var-requires
const StatsWebpackPlugin = require("stats-webpack-plugin");
import { default as WebpackMerge } from "webpack-merge";

import * as AnalysisBase from "./webpack.analysisbase";
import * as Common from "./webpack.common";

const config = WebpackMerge(AnalysisBase.default, {
  output: {
    path: Common.webpackRelative("stats"),
  },
  plugins: [new StatsWebpackPlugin("stats.json")],
});

export default config;
