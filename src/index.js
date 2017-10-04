import { createLogger } from './Helpers/Logger/functions';
import { requireRoutes, start, success, gracefulExit } from './Start';

(() => {
  createLogger()
    .chain(requireRoutes)
    .chain(start)
    .fork(gracefulExit, success);
})();
