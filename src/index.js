import Future from 'fluture';
import { createLogger } from './utils/logger';
import { requireRoutes, start, success, gracefulExit } from './Start';

(() => {
  Future
    .do(function *() {
      const routes = requireRoutes();
      createLogger();
      yield start(routes);
    })
    .fork(gracefulExit, success);
})();
