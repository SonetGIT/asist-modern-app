const proxy = require('http-proxy-middleware');
console.log('proxy')
module.exports = function (app) {
  // app.use(
  //   '/dep',
  //   proxy({
  //     target: 'http://192.168.2.150:44327',
  //     changeOrigin: true,
  //   })
  // );
  app.use(
    '/api',
    proxy({
      target: 'http://192.168.2.150/ASIST-MODERN-API',
      changeOrigin: true,
    })
  );
};