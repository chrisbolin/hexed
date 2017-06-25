const fs = require('fs');

const entryPattern = /js$/;

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
    ],
    noParse: [
      /p5.js/
    ]
  }
};
