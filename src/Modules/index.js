import { createModel as createUserModel } from './Accounts/UserModel';
import { createModel as createTeacherModel } from './Accounts/TeacherModel';
import { createModel as createUserCardModel } from './Cards/UserCardModel';
import { createModel as createTeacherCardModel } from './Cards/TeacherCardModel';
import { createModel as createRefreshTokenModel } from './Tokens/RefreshTokenModel';

export const initialize = () => {
  createUserModel();
  createTeacherModel();
  createUserCardModel();
  createTeacherCardModel();
  createRefreshTokenModel();
};
