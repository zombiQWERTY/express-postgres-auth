import express from 'express';
import routesVersioning from 'express-routes-versioning';

import { generate } from './Token/generate';
import { regenerate } from './Token/regenerate';

export default app => {
  const router = express.Router();
  const versions = routesVersioning();

  router.put('/', versions(generate));
  router.patch('/', versions(regenerate));

  app.use(`/api/token`, router);
};
