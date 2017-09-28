import express from 'express';
import routesVersifying from 'express-routes-versioning';
import { authorize } from '../Modules/Auth';
import { generate } from './Token/generate';
import { regenerate } from './Token/regenerate';

export default app => {
  const router = express.Router();
  const versions = routesVersifying();

  router.put('/', authorize(), versions(generate));
  router.patch('/', versions(regenerate));

  app.use(`/api/token`, router);
};
