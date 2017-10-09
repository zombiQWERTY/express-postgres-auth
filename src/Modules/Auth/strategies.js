import R from 'ramda';
import Future from 'fluture';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Store } from '../Store/Store';
import { tokenType } from '../Tokens/consts';
import { hashBySalt } from '../Hashes/functions';
import { findModel } from '../Accounts/functions';
import { AuthenticationError } from '../../Helpers/Errors/classes';

const isValidTable = table => ['users'].includes(table);

const JWT = () => {
  const { config } = Store.get('config');
  const extractConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secrets.jwt.access
  };

  return new JWTStrategy(extractConfig, (jwtPayload, done) => {
    const { data, type } = jwtPayload;
    if (data && data.userId && data.clientId && data.role && tokenType.access.is(type)) {
      const table = `${data.role}s`;
      if (!isValidTable(table)) { return done(new AuthenticationError(), false); }

      findModel(table, 'id', data.userId)
        .chain(res => res.length > 0 ? Future.of(res[0]) : Future.reject(new AuthenticationError()))
        .map(R.merge({ role: data.role }))
        .fork(_ => done(new AuthenticationError(), null), user => done(null, user));
    } else {
      done(new AuthenticationError(), false);
    }
  });
};

const local = () => {
  const config = {
    session: false,
    usernameField: 'email',
    passReqToCallback: true,
    passwordField: 'password'
  };

  return new LocalStrategy(config, (req, username, plainPassword, done) => {
    const table = `${req.params.role}s`;
    if (!isValidTable(table)) { return done(new AuthenticationError(), false); }

    findModel(table, config.usernameField, R.toLower(username))
      .chain(res => res.length > 0 ? Future.of(res[0]) : Future.reject(new AuthenticationError()))
      .chain(account => {
        const { password, salt } = account;
        return hashBySalt(plainPassword, salt)
          .chain(hash => hash === password ? Future.of(account) : Future.reject(new AuthenticationError()));
      })
      .map(R.merge({ role: req.params.role }))
      .map(R.omit(['password', 'salt', 'deletedAt', 'createdAt', 'updatedAt']))
      .fork(_ => done(new AuthenticationError(), null), account => done(null, account))
  });
};

export const init = () => {
  passport.use('local', local());
  passport.use('jwt', JWT());
};
