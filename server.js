'use strict';
const restify = require('restify');
const mongoose = require('mongoose');
const logger = require('morgan');
const config = require('./config');
const corsMiddleware = require('restify-cors-middleware');
const rjwt = require('restify-jwt-community');
require('dotenv').config();
require('restify').plugins;

const server = restify.createServer();

server.pre(restify.plugins.pre.userAgentConnection());
// server.pre(function (request, response, next) {
//   request.log.info({ req: request }, 'REQUEST');
//   next();
// });

// server.pre(function (request, response, next) {
//   request.log.info({ req: request }, 'REQUEST');
//   next();
// });

// Middleware
server.use(restify.plugins.bodyParser());
// Protect All Routes except /auth. To specified protected route insert the middleware:rjwt({ secret: config.JWT_SECRET })
 //server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth'] }));


 server.use(logger('dev'));

server.use(restify.plugins.queryParser());

//CORS
const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['http://localhost:8080', 'https://*.herokuapp.com'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']

});
server.pre(cors.preflight);
server.use(cors.actual);

server.listen(config.PORT, () => {
  mongoose.set('useFindAndModify', false);
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});
  

const db = mongoose.connection;

db.once('open', () => {
  
  require('./routes/api/v1.0/users')(server);
  console.log(`Server started on port ${config.PORT}`);
});




// server.get('/api', restify.plugins.serveStaticFiles('./public'));
// server.get('/', restify.plugins.serveStaticFiles('./public/api'));