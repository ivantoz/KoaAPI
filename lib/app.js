const Koa = require('koa');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');
const config = require('config');
const koaQs = require('koa-qs');
const { ValidationError: MongooseValidationError } = require('mongoose/lib/error');
const bodyParser = require('koa-bodyparser');
const _ = require('lodash');
const koaBunyanLogger = require('koa-bunyan-logger');
const db = require('../models');

// files
const routes = require('../routes');

// environment variables
const { JWT_KEY } = process.env;

// create app
const app = koaQs(new Koa());

if (config.get('app.loggingEnabled')) {
  app.use(bodyParser());
}

app.use(koaBunyanLogger());

// allow cors
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  exposeHeaders: ['X-Total-Count', 'Link', 'ETag'],
}));


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
      this.log().error(err);
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
// app.use(routes.fellows.middleware());


module.exports = app;