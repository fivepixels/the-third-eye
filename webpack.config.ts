import path from "path";
import webpack from "webpack";
// import "webpack-dev-server";

const config: webpack.Configuration = {
  mode: "development",
  devtool: "source-map",
  entry: {
    "cs/main": "./src/core/cs/index.ts",
    "sw/main": "./src/core/sw/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};

export default config;
