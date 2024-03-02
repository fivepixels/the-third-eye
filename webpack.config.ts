import webpack from "webpack";
import path from "path";
import { sync } from "glob";

const config: webpack.Configuration = {
  mode: "development",
  devtool: process.env.NODE_ENV === "production" ? false : "source-map",
  entry: {
    cs: sync("./src/core/cs/**/*.ts"),
    sw: sync("./src/core/sw/**/*.ts"),
    client: sync("./src/core/client/**/*.ts")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".js"],
    preferRelative: true
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
      cacheGroups: {
        default: false
      }
    }
  },
  stats: {
    errorDetails: true
  }
};

export default config;
