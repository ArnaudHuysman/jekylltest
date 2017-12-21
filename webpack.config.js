const path = require('path');

module.exports = {
  output: {
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, "./assets/js")
        ],
        exclude: [
          path.resolve(__dirname, "./node_modules")
        ],
        loader: "babel-loader?cacheDirectory"
      }
    ]
  }
}
