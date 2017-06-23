const fs = require('fs');

const entryPattern = /js$|css$|scss$/;

const exclude = /node_modules/;
const entry = fs.readdirSync('.')
  .filter(fileName => entryPattern.test(fileName))
  .map(fileName => `./${fileName}`);

module.exports = {
  entry,
  output: {
    filename: "dist/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude,
        query: {
          presets: ['react', 'stage-2', 'es2016', 'es2015']
        },
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        exclude,
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
        exclude,
      }
    ],
    noParse: [
      /p5.js/
    ]
  }
};
