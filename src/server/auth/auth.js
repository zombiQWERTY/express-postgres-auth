import passport from 'passport';
import Error from '../errors/ApplicationError';
import UserManager from '../manager/UserManager';

export default passport.authenticate('session');

export const authLocal = (req, res, next) => {
    passport.authenticate('local', { session: true }, async (error, user) => {
        if (error) {
            const errorObject = new Error('Invalid login or password', { type: 'Auth', reason: error });
            return res.setRes.fail({
                status: 401,
                message: errorObject.message
            });
        } else {
            const userData = await UserManager.login(req, user);
            next(null, userData);
        }
    })(req, res, next);
};
