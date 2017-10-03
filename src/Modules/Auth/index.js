import passport from 'passport';
import { AuthenticationError } from '../../Helpers/Errors/classes';

export const authorize = () => passport.authenticate('local', { session: false });
export const authenticate = () => (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (error, jwtPayload, jwtError) => {
    if (error || jwtError) {
      return next(new AuthenticationError(), null);
    } else {
      req.logIn(jwtPayload, { session: false }, error => {
        if (error) {
          return next(new AuthenticationError(), null);
        } else {
          return next(null, jwtPayload);
        }
      });
    }
  })(req, res, next);

export const onlyTeacherStub = () => (req, res, next) => {
  if (req.user) {
    if (req.user.role !== 'teacher') {
      return next(new AuthenticationError('Access denied.'));
    } else {
      return next();
    }
  } else {
    return next(new AuthenticationError('Access denied.'));
  }
};
