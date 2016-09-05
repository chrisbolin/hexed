var webpack = require("webpack");

var webpackConfig = require("./webpack.config");

// returns a Compiler instance
const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  console.log(err ? "Error" : "Success");
});
