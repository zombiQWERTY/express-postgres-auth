import Strategy from 'passport-local';

import UserModel from '../../models/User';
import { hashPasswordBySalt } from '../../manager/passwordUtils';

export default function localStrategy() {
    const options = {
        usernameField: 'email',
        usernameQueryFields: ['username']
    };

    return new Strategy(options, async (email, password, done) => {
        const login = email.toLowerCase();

        const genError = message => {
            let error = new Error(message);
            error = {
                ...error,
                name: 'AuthenticationError',
                status: 401
            };

            return done(error, null);
        };

        let user;
        try {
            user = await UserModel
                .findOne({
                    $or: [{ email: login }, { username: login }]
                })
                .select('+password +salt');
        } catch (error) {
            return genError('Password or login are incorrect.');
        }

        if (!user) {
            return genError('Password or login are incorrect.');
        }
        if (!user.password || !user.salt) {
            return genError(
                'Authentication not possible. No salt value stored.'
            );
        }

        let hashedPassword;
        try {
            hashedPassword = await hashPasswordBySalt(password, user.salt);
        } catch (error) {
            return genError('Password or login are incorrect.');
        }

        if (hashedPassword === user.password) {
            return done(null, user);
        }

        return genError('Password or login are incorrect.');
    });
}
