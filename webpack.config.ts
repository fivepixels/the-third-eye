import webpack, { ExternalItemFunctionData } from "webpack";
import path from "path";
import { sync } from "glob";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const webpackConfig: webpack.Configuration = {
  mode: "development",
  devtool: false,
  entry: {
    cs: sync("./src/core/cs/**/*.ts"),
    sw: sync("./src/core/sw/**/*.ts"),
    popup: sync("./src/core/client/popup/popup.ts")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".js"],
    preferRelative: true,
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@cs": path.resolve(__dirname, "./src/core/cs"),
      "@sw": path.resolve(__dirname, "./src/core/sw"),
      "@shapes": path.resolve(__dirname, "./src/shapes")
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: { default: false }
    }
  },
  stats: {
    errorDetails: true
  },
  plugins: [new BundleAnalyzerPlugin()]
};

export default webpackConfig;
