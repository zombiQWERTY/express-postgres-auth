import { createModel as createUserModel } from './Accounts/UserModel';
import { createModel as createTeacherModel } from './Accounts/TeacherModel';
import { createModel as createUserCardModel } from './Card/UserCardModel';
import { createModel as createTeacherCardModel } from './Card/TeacherCardModel';

export const initialize = () => {
  createUserModel();
  createTeacherModel();
  createUserCardModel();
  createTeacherCardModel();
};
