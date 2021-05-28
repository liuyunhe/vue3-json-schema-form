/* eslint-disable prettier/prettier */
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
  }
};