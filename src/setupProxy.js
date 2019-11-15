const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/sap/opu/odata/sap', {
      target: 'https://dcpg2gtwapp1.compass-group.digital:8024',
      changeOrigin: true,
      secure: false,
      onProxyRes: proxyRes => {
        if (proxyRes.headers) {
          proxyRes.headers['Access-Control-Allow-Origin'] = '*'
        }
      },
    })
  )
}
