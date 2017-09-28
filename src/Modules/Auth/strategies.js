import R from 'ramda';
import Future from 'fluture';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { tokenType } from '../Tokens/consts';
import { hashBySalt } from '../Hashes/functions';
import { fetchByField } from '../Cards/functions';
import { fetchAccount } from '../Accounts/getters';
import { Store } from '../../Start/ConnectionsStore';

export const JWT = () => {
  const { config } = Store.get('config');
  const Card = Store.get('Models.Cards.Student');

  const extractConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secrets.jwt
  };

  return new JWTStrategy(extractConfig, (jwtPayload, done) => {
    const { data, type } = jwtPayload;
    if (data.id && tokenType.access.is(type)) {
      fetchByField(Card, 'id', data.id)
        .map(user => user.toJSON())
        .fork(error => done(error, false), user => done(null, user));
    }
  });
};

export const local = () => {
  const config = {
    session: false,
    usernameField: 'email',
    passReqToCallback: true,
    passwordField: 'password'
  };

  const StudentCard = Store.get('Models.Cards.Student');
  const TeacherCard = Store.get('Models.Cards.Teacher');

  return new LocalStrategy(config, (req, username, plainPassword, done) => {
    let Card;
    switch (req.params.group) {
      case ('student'): {
        Card = StudentCard;
        break;
      }

      case ('teacher'): {
        Card = TeacherCard;
        break;
      }

      default: {
        return done(null, false);
      }
    }

    return fetchAccount(Card, config.usernameField, R.toLower(username))
      .chain(model => model ? Future.of(model) : Future.reject(false))
      .chain(model => {
        const { password, salt } = model.related('credentials');
        return hashBySalt(plainPassword, salt)
          .chain(hash => hash === password ? Future.of(model) : Future.reject(false));
      })
      .map(model => model.toJSON())
      .fork(error => done(error, null), model => done(null, model))
  });
};

export const init = () => {
  passport.use('local', local());
  passport.use('jwt', JWT());
};
