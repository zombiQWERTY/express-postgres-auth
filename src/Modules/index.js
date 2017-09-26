import { createModel as createUserModel } from './Accounts/UserModel';
import { createModel as createTeacherModel } from './Accounts/TeacherModel';
import { createModel as createUserCardModel } from './Cards/UserCardModel';
import { createModel as createTeacherCardModel } from './Cards/TeacherCardModel';

export const initialize = () => {
  createUserModel();
  createTeacherModel();
  createUserCardModel();
  createTeacherCardModel();
};
