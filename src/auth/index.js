import passport from 'passport';

export const authenticate = () => passport.authenticate('jwt', { session: false });
export const authorize = () => passport.authenticate('local', { session: false });
