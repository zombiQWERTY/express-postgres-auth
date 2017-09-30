import { createModel as createLessonsModel } from './Lessons/LessonsModel';
import { createModel as createStudentModel } from './Accounts/StudentModel';
import { createModel as createTeacherModel } from './Accounts/TeacherModel';
import { createModel as createStudentCardModel } from './Cards/StudentCardModel';
import { createModel as createTeacherCardModel } from './Cards/TeacherCardModel';
import { createModel as createLanguagesModel } from './Languages/LanguagesModel';
import { createModel as createRefreshTokenModel } from './Tokens/RefreshTokenModel';
import { createModel as createTeacherAvailabilityModel } from './Timetable/TeacherAvailabilityModel';

export const initialize = () => {
  createLessonsModel();
  createStudentModel();
  createTeacherModel();
  createLanguagesModel();
  createStudentCardModel();
  createTeacherCardModel();
  createRefreshTokenModel();
  createTeacherAvailabilityModel();
};
