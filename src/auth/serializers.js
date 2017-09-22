import R from 'ramda';
import passport from 'passport';
import { byField } from '../Modules/Users/getters';

export default () => {
  passport.serializeUser((user, done) => done(null, R.pathOr(false, ['id'], user)));

  passport.deserializeUser((id, done) => byField('id', id)
    .map(rows => rows.attributes)
    .fork(error => done(error, null), user => done(null, user)));
};
