import passport from 'passport';
import localStrategy from '../auth/local';

export default () => {
    passport.use('local', localStrategy());
};
