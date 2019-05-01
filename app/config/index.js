const apiPrivateRoutes = require('../routes/apiPrivateRoutes');
const apiPublicRoutes = require('../routes/apiPublicRoutes');
const webRoutes = require('../routes/webRouters');
const config = {
  migrate: false,
  apiPrivateRoutes,
  apiPublicRoutes,
  webRoutes,
  port: '3000',
};

module.exports = config;
