import R from 'ramda';
import path from 'path';
import http from 'http';
import mkdirp from 'mkdirp';
import Future from 'fluture';
import express from 'express';
import { fromEvent } from 'most';

import { NODE_ENV } from '../utils/NODE_ENV';
import config from '../../config/config.json';
import { genericLogger } from '../utils/logger';
import { createDBConnection } from '../db/index';
import { getURI, getBaseURI } from '../utils/baseURI';
import { createRedisConnection } from '../redis/client';
import { middleware, customMiddleware } from './middleware';
import { createWarlock, executeOnce } from '../redis/Warlock';

export const gracefulExit = (...args) => {
  genericLogger.error(...args);
  setTimeout(() => process.exit(1), 300);
};

const initAlways = app => [];
const initOnce = app => [];

const resolvePath = folder => path.resolve(__dirname, '../../' + folder);
const createFolder = path => Future((reject, resolve) =>
  mkdirp(path, error => error ? reject(error) : resolve()));

export const createStructure = () => {
  const folders = [resolvePath('./log')];
  const futures = R.map(createFolder, folders);

  return Future.parallel(Infinity, futures);
};

export const start = routes => {
  const Redis = createRedisConnection(config.redis);
  createWarlock(Redis);
  createDBConnection(config.db);

  const app = express();
  app.use(middleware());
  customMiddleware(app, routes);

  const URI = getURI();
  const server = http.createServer(app);
  server.listen(URI.startport, () => {
    executeOnce('initAppOnce', unlock =>
      Future.parallel(Infinity, initOnce(app))
        .fork(gracefulExit, unlock));

    Future.parallel(Infinity, initAlways(app))
      .fork(gracefulExit, () => {
        genericLogger.verbose(`Server started on port ${URI.port}.`);
        genericLogger.verbose(`Environment: ${NODE_ENV}.`);
        genericLogger.verbose(`Base URI: ${getBaseURI()}.`);
      });
  });

  fromEvent('error', server)
    .observe(({ code, syscall, message }) => {
      if (syscall !== 'listen') { return gracefulExit('Error on start up.', message); }
      if (code === 'EACCES') { return gracefulExit('Port requires elevated privileges.'); }
      if (code === 'EADDRINUSE') { return gracefulExit('Port is already in use.'); }

      gracefulExit(message);
    });
};
