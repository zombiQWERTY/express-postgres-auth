import R from 'ramda';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { types } from '../Modules/Tokens/consts';
import { Store } from '../Start/ConnectionsStore';
import { byField } from '../Modules/Users/getters';
import { hashBySalt } from '../Modules/Hashes/functions';

export const JWT = () => {
  const { config } = Store.get('config');

  const extractConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secrets.jwt
  };

  return new JWTStrategy(extractConfig, (jwtPayload, done) => {
    const { user, type } = jwtPayload;

    return type === types.ACCESS ? done(null, user) : done(null, false);
  });
};

export const local = () => {
  const config = {
    session: false,
    usernameField: 'email',
    passReqToCallback: true,
    passwordField: 'password'
  };

  return new LocalStrategy(config, (req, username, password, done) => {
    username = R.toLower(username);

    byField(config.usernameField, username)
      .map(rows => rows.attributes)
      .chain(user => {
        const { password, salt } = user;
        const hash = hashBySalt(password, salt);
        return hash === password ? user : false;
      })
      .fork(error => done(error, null), user => done(null, user));
  });
};

export const init = () => {
  passport.use('local', local());
  passport.use('jwt', JWT());
};
