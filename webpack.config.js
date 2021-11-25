const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const plugins = [new MiniCssExtractPlugin(), new CleanWebpackPlugin()].filter(
  Boolean
);

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "embed"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  plugins,
};
