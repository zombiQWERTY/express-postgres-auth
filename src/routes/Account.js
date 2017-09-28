import express from 'express';
import routesVersifying from 'express-routes-versioning';
import { create as createStudent } from './Account/createStudent';
import { create as createTeacher } from './Account/createTeacher';

export default app => {
  const router = express.Router();
  const versions = routesVersifying();

  router.put('/student', versions(createStudent));
  router.put('/teacher', versions(createTeacher));

  app.use(`/api/account`, router);
};
