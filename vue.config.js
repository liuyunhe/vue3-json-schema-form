/* eslint-disable prettier/prettier */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
// const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    host: 'localhost',
    port: 8080,
    https: false,
    open: true,
    hotOnly: true,
    // proxy: {

    // },
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    // }
  },
  chainWebpack(config) {
    config.plugin('monaco').use(new MonacoWebpackPlugin())
    // config.plugin('circular').use(new CircularDependencyPlugin())
  },
};