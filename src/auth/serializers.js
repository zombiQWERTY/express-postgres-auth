import R from 'ramda';
import passport from 'passport';
import { byField } from '../Modules/Users/getters';

export const serialize = (user, done) => done(null, R.pathOr(false, ['id'], user));

export const deserialize = (id, done) => byField('id', id)
  .map(rows => rows.attributes)
  .fork(error => done(error, null), user => done(null, user));

export const init = app => {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  return app;
};
