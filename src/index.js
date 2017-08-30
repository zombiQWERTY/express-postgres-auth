import Future from 'fluture';
import { createLogger } from './utils/logger';
import { requireRoutes, start, success, gracefulExit } from './Start';

(() => {
  Future.of(createLogger())
    .chain(() => requireRoutes())
    .chain(routes => start(routes))
    .fork(gracefulExit, success);
})();
