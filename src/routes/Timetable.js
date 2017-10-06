import express from 'express';
import routesVersifying from 'express-routes-versioning';
import { find as findTeachers } from './Timetable/findTeachers';
import { authenticate, onlyTeacherStub, onlyStudentStub } from '../Modules/Auth';
import { add as teacherAddAvailableTime } from './Timetable/teacherAddAvailableTime';

export default app => {
  const router = express.Router();
  const versions = routesVersifying();

  router.put('/teacher/availability', authenticate(), onlyTeacherStub(), versions(teacherAddAvailableTime));
  router.post('/teacher/find', authenticate(), onlyStudentStub(), versions(findTeachers));

  app.use(`/api/timetable`, router);
};
