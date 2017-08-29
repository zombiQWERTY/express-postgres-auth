import R from 'ramda';
import Future from 'fluture';
import importDir from 'import-dir';
import { createLogger } from './utils/logger';
import { createStructure, gracefulExit, start } from './Start';

(() => {
  createStructure()
    .chain(() => Future.of(createLogger()))
    .chain(() => Future.of([importDir('./routes')]))
    .chain(routes => Future.of(start(routes)))
    .fork(gracefulExit, R.identity);
})();
