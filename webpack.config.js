module.exports = {
  output: {
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /assets\/js/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
