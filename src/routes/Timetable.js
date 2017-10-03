import express from 'express';
import routesVersifying from 'express-routes-versioning';
import { authenticate, onlyTeacherStub } from '../Modules/Auth';
import { add as teacherAddAvailableTime } from './Timetable/teacherAddAvailableTime';

export default app => {
  const router = express.Router();
  const versions = routesVersifying();

  // router.put('/student', versions(createStudent));
  router.put('/teacher/availability', authenticate(), onlyTeacherStub(), versions(teacherAddAvailableTime));

  app.use(`/api/timetable`, router);
};
