import R from 'ramda';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'express-log';
import qs from 'express-qs-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import compose from 'compose-middleware';
import { setRes } from './responseHandler';

const maxAge = 1200;
const preflightContinue = true;
const origin = ['http://localhost', 'https://iqlang.com'];
const methods = ['OPTIONS', 'GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD'];

const allowedHeaders = [
  'DNT',
  'Pragma',
  'Keep-Alive',
  'Account-Agent',
  'Content-Type',
  'Authorization',
  'Cache-Control',
  'X-CustomHeader',
  'X-Requested-With',
  'If-Modified-Since'
];

export const middleware = () => compose.compose([
  compression(),
  helmet(),
  logger(),
  bodyParser.json({ limit: '50mb' }),
  bodyParser.urlencoded({ extended: false, limit: '50mb' }),
  cors({ origin, methods, allowedHeaders, maxAge, preflightContinue }),
  qs({})
]);

export const customMiddleware = R.curry((app, routes) => {
  app.use((req, res, next) => {
    res.setRes = setRes(req, res);
    next();
  });

  R.forEach(section =>
    R.compose(R.forEach(name => section[name](app)), R.keys)(section), routes);

  app.use((error, req, res, next) => {
    res.setRes.fail({
      message: error.message,
      status: error.status || 500,
      detail: error.detail
    });
  });

  return app;
});
