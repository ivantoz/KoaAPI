const Koa = require('koa');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');
const config = require('config');
const { ValidationError: MongooseValidationError } = require('mongoose/lib/error');
const koaBunyanLogger = require('koa-bunyan-logger');
const responseHandler = require('koa-response-handler');
const koaQS = require('../middlewares/koa-qs');
const db = require('../models');
const logMiddleware = require('../middlewares/log');
const logger = require('./logger');
const requestId = require('../middlewares/requestId');
// const responseHandler = require('../middlewares/responseHandler');

// files
const routes = require('../routes');

// environment variables
const { JWT_KEY } = process.env;


const app = koaQS(new Koa());

// app.use(
//   bodyParser({
//     enableTypes: ['json'],
//     formLimit: '10mb',
//     jsonLimit: '10mb',
//   }),
// );

app.use(requestId());

if (config.get('app.loggingEnabled')) {
  app.use(koaBunyanLogger());
}
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());
app.use(koaBunyanLogger.timeContext());

// allow cors
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  exposeHeaders: ['X-Total-Count', 'Link', 'ETag'],
}));

app.use(responseHandler());
app.use(logMiddleware({ logger }));

// error middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof MongooseValidationError) {
      ctx.throw(400, err);
      return;
    }
    ctx.status = err.status || 500;
    if (ctx.status === 500) {
      console.error(err);
      ctx.body = '';
    } else {
      ctx.body = err.body || err.message;
    }
    ctx.app.emit('error', err, this);
  }
});

app.use(async (ctx, next) => {
  ctx.models = db.models;

  await next();
});

// user routes (pre-jwt enforcement)
app.use(routes.users.middleware());


// enforce jwt
app.use(jwt({ secret: JWT_KEY, key: 'jwt', debug: config.get('jwt.debugEnabled') }));

// private routes
app.use(routes.fellows.middleware());


module.exports = app;
