const httpProxy = require('http-proxy');

opts = {
  logFilePath: './logs/attendance.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
};

const log = require('simple-node-logger').createSimpleLogger(opts);

var body = [];  

httpProxy.createProxyServer({
  target: {
    protocol: 'https:',
    host: process.env.HOST,
    port: 443,
  },
  changeOrigin: true,
}).on('proxyReq', function(proxyReq, req, res, options) {
  log.info(req.url);
  proxyReq.setHeader('x-api-key', process.env.API_KEY);
}).on('proxyRes', function(proxyRes, req, res) {

  var body = [];
  proxyRes.on('data', function (chunk) {
      body.push(chunk);
  });
  proxyRes.on('end', function () {
      body = Buffer.concat(body).toString();
      log.info("res from proxied server:", body);
      res.end("my response to cli");
  });
}).listen(8000);
