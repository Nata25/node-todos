// let setCache = function (req, res, next) {
//   // 1 day
//   const period = 60 * 60 * 24

//   // you only want to cache for GET requests
//   if (req.method == 'GET') {
//     res.set('Cache-control', `public, max-age=${period}`)
//   } else {
//     // for the other requests set strict no caching parameters
//     res.set('Cache-control', `no-store`)
//   }

//   // remember to call next() to pass on the request
//   next()
// }

const serveStatic = require('serve-static');
const path = require('path');

function setCache (app) {
  console.log('setCache');
  app.use(serveStatic(path.join(__dirname, 'client'), {
    maxAge: '1d',
    setHeaders: setCustomCacheControl
  }));
  
  function setCustomCacheControl (res, path) {
    if (serveStatic.mime.lookup(path) === 'image/svg+xml') {
      // Custom Cache-Control for SVG files
      res.setHeader('Cache-Control', 'public, max-age=0')
    }
  }
}

module.exports = setCache;
