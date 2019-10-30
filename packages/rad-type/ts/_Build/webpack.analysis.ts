import * as BundleAnalyzerPlugin from "webpack-bundle-analyzer";
import { default as WebpackMerge } from "webpack-merge";

import * as AnalysisBase from "./webpack.analysisbase";
import * as Common from "./webpack.common";

const config = WebpackMerge(AnalysisBase.default, {
  output: {
    path: Common.webpackRelative("analysis"),
  },
  plugins: [new BundleAnalyzerPlugin.BundleAnalyzerPlugin()],
});

export default config;
