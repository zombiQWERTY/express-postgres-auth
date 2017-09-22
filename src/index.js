import Future from 'fluture';
import { createLogger } from './utils/logger';
import { requireRoutes, start, success, gracefulExit } from './Start';

(() => {
  Future
    .do(function *() {
      createLogger();

      const routes = requireRoutes();
      yield start(routes);
    })
    .fork(gracefulExit, success);
})();
