import express from 'express';
import routesVersifying from 'express-routes-versioning';
import { create as createUser } from './Account/createUser';

export default app => {
  const router = express.Router();
  const versions = routesVersifying();

  router.put('/', versions(createUser));

  app.use(`/api/account`, router);
};
