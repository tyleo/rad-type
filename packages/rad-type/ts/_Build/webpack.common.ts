import * as Path from "path";

import { default as HtmlWebpackPlugin } from "html-webpack-plugin";
import * as Webpack from "webpack";

// From target/ts/_Build
const basePath = Path.resolve(__dirname, "../../..");
export const baseRelative = (path: string) => Path.resolve(basePath, path);
const srcPath = Path.resolve(basePath, "target/ts");
export const srcRelative = (path: string) => Path.resolve(srcPath, path);
const webpackPath = Path.resolve(basePath, "target/webpack");
export const webpackRelative = (path: string) =>
  Path.resolve(webpackPath, path);

export interface IDefines {
  readonly SERVER_FLAVOR?: string;
  readonly BASE_PATH?: string;
}

export const makeCommon = (defines?: IDefines): Webpack.Configuration => {
  const defaultDefines = {
    SERVER_FLAVOR: JSON.stringify("LOCAL"),
    BASE_PATH: JSON.stringify(basePath),
  };
  defines = { ...defaultDefines, ...defines };

  return {
    entry: srcRelative("renderer.js"),
    module: {
      rules: [
        {
          test: /\.(png)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "img",
              },
            },
          ],
        },
        {
          test: /\.(ico)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "font",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: baseRelative("asset/html/index.html"),
        inlineSource: ".js",
      }),
      new Webpack.DefinePlugin(defines),
    ],
    resolve: {
      extensions: [".js"],
    },
  };
};
