var path = require("path")
var nodeExternals = require('webpack-node-externals');

function e(key) {
  return process.env[key]
}

var config = {
  cache : false
  , target : 'node'
  , externals: [nodeExternals()]
  , debug: false
  , devtool: "source-map"
  , entry: './source/minimalApi.js'
  , output: {
    path: path.join(__dirname, 'dist')
    , filename: 'api.bundle.js'
    , libraryTarget: "commonjs2"
  }
  , resolve: {
    extensions : ['', '.js']
    , root: [
      path.join(__dirname, 'node_modules')
    ]
  }
  , exclude: /node_modules/
  , plugins: [ ]
  , module : {
    preLoaders: [ ]
    , loaders: [
      {
        test: /\.js$/
        , exclude: /node_modules/
        , loaders: ['babel']
      }
    ]
  }
}

module.exports = config
