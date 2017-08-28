import R from 'ramda';
import passport from 'passport';
import UserManager from '../manager/UserManager';

export default () => {
  passport.serializeUser(
    (user, done) =>
      R.pathOr(false, ['_id'], user) ? done(null, user._id) : done(new Error('Missing user.'), null)
  );

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserManager.getById(id);
      return user ? done(null, user) : done(new Error('Missing user.'), null);
    } catch (error) {
      done(error, null);
    }
  });
};
