import R from 'ramda';
import path from 'path';
import http from 'http';
import mkdirp from 'mkdirp';
import Future from 'fluture';
import express from 'express';
import { fromEvent } from 'most';

import { db } from '../server/db/index';
import { NODE_ENV } from '../server/utils/NODE_ENV';
import { genericLogger } from '../server/utils/logger';
import { middleware, customMiddleware } from './middleware';
import { createWarlock, executeOnce } from '../redis/Warlock';
import { getURI, getBaseURI } from '../server/utils/baseURI';
import { createRedisConnection, handleRedisEvents } from '../redis/client';

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
  const Redis = createRedisConnection();
  const Warlock = createWarlock(Redis);
  handleRedisEvents(Redis);

  const app = express();
  app.use(middleware());
  customMiddleware(app, routes);

  const URI = getURI();
  const server = http.createServer(app);
  server.listen(URI.startport, () => {
    executeOnce(Warlock, 'initAppOnce', unlock =>
      Future.parallel(Infinity, initOnce(app))
        .fork(gracefulExit, unlock));

    Future.parallel(Infinity, initAlways(app, routes))
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
