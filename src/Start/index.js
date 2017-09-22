import R from 'ramda';
import http from 'http';
import Future from 'fluture';
import express from 'express';
import { fromEvent } from 'most';
import importDir from 'import-dir';
import knex from '../../knex';
import config from '../../config/config.json';

import { createFolder } from './utils';
import { Store } from './ConnectionsStore';
import { NODE_ENV } from '../utils/NODE_ENV';
import { genericLogger } from '../utils/logger';
import { createDBConnection } from '../db/index';
import { getURI, getBaseURI } from '../utils/baseURI';
import { middleware, customMiddleware } from './middleware';
import { initialize as modulesInitialize } from '../Modules/index';
import { createRedisConnection, handleRedisEvents } from '../redis/client';

const createStructure = () => {
  const folders = ['./log'];
  const futures = R.map(createFolder, folders);
  return Future.parallel(Infinity, futures);
};

const HTTPEventsListener = server => {
  return Future((reject, resolve) => {
    fromEvent('error', server)
      .observe(({ code, syscall, message }) => {
        if (syscall !== 'listen') { return reject('Error on start up.', message); }
        if (code === 'EACCES') { return reject('Port requires elevated privileges.'); }
        if (code === 'EADDRINUSE') { return reject('Port is already in use.'); }

        reject(message);
      });

    fromEvent('listening', server)
      .observe(() => resolve(server));
  });
};

export const requireRoutes = () => Future.of([importDir('../routes')]);

export const success = server => {
  genericLogger.verbose(`Server started on port ${server.address().port}.`);
  genericLogger.verbose(`Environment: ${NODE_ENV}.`);
  genericLogger.verbose(`Base URI: ${getBaseURI()}.`);
};

export const gracefulExit = (...args) => {
  genericLogger.error(...args);
  setTimeout(() => process.exit(1), 500);
};

export const start = routes =>
  Future.of(createStructure())
    .chain(() => Future.of(Store.add('config', { config, knex })))
    .chain(() => Future.of(Store.add('db', createDBConnection(knex[NODE_ENV]))))
    .chain(() => Future.of(Store.add('redis', createRedisConnection())))
    .chain(Redis => Future.of(handleRedisEvents(Redis)))
    .chain(() => Future.of(modulesInitialize()))
    .chain(() => Future.of(express()))
    .chain(app => Future.of(app.use(middleware())))
    .chain(app => Future.of(customMiddleware(app, routes)))
    .chain(app => Future.of(http.createServer(app).listen(getURI().startport)))
    .chain(app => Future.of(Store.add('app', app)))
    .chain(server => HTTPEventsListener(server))
    .chain(server => Future.of(Store.add('server', server)));
