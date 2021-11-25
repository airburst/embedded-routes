const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const plugins = [new CleanWebpackPlugin()].filter(Boolean);

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
        test: /\.(js|jsx)$/,
        exclude: /nodeModules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  plugins,
};
