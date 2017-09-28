import express from 'express';
import routesVersioning from 'express-routes-versioning';

import { create } from './Account/create';

export default app => {
  const router = express.Router();
  const versions = routesVersioning();

  router.put('/:group', versions(create));

  app.use(`/api/account`, router);
};
