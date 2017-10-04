import R from 'ramda';
import http from 'http';
import Future from 'fluture';
import express from 'express';
import { fromEvent } from 'most';
import importDir from 'import-dir';
import knex from '../../knexfile';
import config from '../../config/config.json';

import { createFolder } from './utils';
import { Store } from '../Modules/Store/Store';
import { createDBConnection } from '../db/index';
import { NODE_ENV } from '../Helpers/ENV/NODE_ENV';
import { genericLogger } from '../Helpers/Logger/functions';
import { middleware, customMiddleware } from './middleware';
import { init as initStrategiesPassport } from '../Modules/Auth/strategies';
// import { createRedisConnection, handleRedisEvents } from '../redis/client';

const createStructure = () => {
  const folders = ['./log'];
  const futures = R.map(createFolder, folders);
  return Future.parallel(Infinity, futures);
};

const HTTPEventsListener = server =>
  Future((reject, resolve) => {
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

export const requireRoutes = () => Future.of([importDir('../routes')]);

export const success = () => {
  genericLogger.verbose(`Server started on port ${config.service.port}.`);
  genericLogger.verbose(`Environment: ${NODE_ENV}.`);
};

export const gracefulExit = (...args) => {
  genericLogger.error(...args);
  setTimeout(() => process.exit(1), 500);
};

export const start = routes => Future
  .do(function *() {
    Store.add('config', { config, knex });

    yield createStructure();
    const knexConnection = yield Future.of(createDBConnection(knex[NODE_ENV]));
    Store.add('knex', knexConnection);

    // const Redis = yield Future.of(createRedisConnection());
    // handleRedisEvents(Redis);
    // Store.add('redis', Redis);

    const app = express();
    app.use(middleware());

    initStrategiesPassport();

    customMiddleware(app, routes);
    Store.add('app', app);

    const server = http.createServer(app).listen(config.service.port);
    yield HTTPEventsListener(server);
    Store.add('server', server);
  });
