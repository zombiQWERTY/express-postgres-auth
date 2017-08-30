import Future from 'fluture';
import importDir from 'import-dir';
import { createLogger } from './utils/logger';
import { gracefulExit, start, success } from './Start';

(() => {
  Future.of(createLogger())
    .chain(() => Future.of([importDir('./routes')]))
    .chain(routes => start(routes))
    .fork(gracefulExit, success);
})();
