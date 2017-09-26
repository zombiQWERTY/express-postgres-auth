import Future from 'fluture';
import { createLogger } from './utils/logger';
import { requireRoutes, start, success, gracefulExit } from './Start';

(() => {
  Future
    .of(createLogger())
    .map(requireRoutes)
    .chain(start)
    .fork(gracefulExit, success);
})();
