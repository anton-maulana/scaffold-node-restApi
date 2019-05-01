/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });

/**
 * server configuration
 */
const config = require('./config');
const dbService = require('./services/db.service');
const auth = require('./auth/auth.policy');

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedApiOpenRoutes = mapRoutes(config.apiPublicRoutes, 'app/controllers/');
const mappedApiAuthRoutes = mapRoutes(config.apiPrivateRoutes, 'app/controllers/');
const mappedWebRoutes = mapRoutes(config.webRoutes, 'app/controllers/');
const DB = dbService(environment, config.migrate).start();


/*Set EJS template Engine*/
app.set('views','app/views');
app.set('view engine','ejs');

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// secure your private routes with jwt authentication middleware
app.all('/api/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/', mappedWebRoutes)
app.use('/api/public', mappedApiOpenRoutes);
app.use('/api/private', mappedApiAuthRoutes);

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  console.log(`Listen apps in port ${config.port}`)
  return DB;
});
