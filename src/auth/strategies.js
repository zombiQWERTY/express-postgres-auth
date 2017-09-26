import R from 'ramda';
import Future from 'fluture';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Store } from '../Start/ConnectionsStore';
import { tokenType } from '../Modules/Tokens/consts';
import { hashBySalt } from '../Modules/Hashes/functions';
import { fetchAccount } from '../Modules/Accounts/getters';

export const JWT = () => {
  const { config } = Store.get('config');

  const extractConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secrets.jwt
  };

  return new JWTStrategy(extractConfig, (jwtPayload, done) => {
    const { user, type } = jwtPayload;

    return done(null, tokenType.access.is(type) && user);
  });
};

export const local = () => {
  const config = {
    session: false,
    usernameField: 'email',
    passReqToCallback: true,
    passwordField: 'password'
  };

  const Card = Store.get('Models.Card.User');

  return new LocalStrategy(config, (req, username, plainPassword, done) =>
    fetchAccount(Card, config.usernameField, R.toLower(username))
      .chain(model => model ? Future.of(model) : Future.reject(false))
      .chain(model => {
        const { password, salt } = model.related('credentials');
        return hashBySalt(plainPassword, salt)
          .chain(hash => hash === password ? Future.of(model) : Future.reject(false));
      })
      // .map(model => model.toJSON())
      // .map(R.omit(['credentials']))
      .fork(error => done(error, null), model => done(null, model)));
};

export const init = () => {
  passport.use('local', local());
  passport.use('jwt', JWT());
};
