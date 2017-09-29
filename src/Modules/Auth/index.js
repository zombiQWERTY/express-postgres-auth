import passport from 'passport';
import { AuthenticationError } from '../../utils/errors';

export const authorize = () => passport.authenticate('local', { session: false });
export const authenticate = () => (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (error, jwtPayload, jwtError) =>
    next(error || jwtError ? new AuthenticationError() : jwtPayload))(req, res, next);
