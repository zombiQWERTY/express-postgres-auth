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

const getCard = () => {
  const StudentCard = Store.get('Models.Cards.Student');
  const TeacherCard = Store.get('Models.Cards.Teacher');

  return role => {
    switch (role) {
      case 'student': {
        return StudentCard;
      }

      case 'teacher': {
        return TeacherCard;
      }

      default: {
        return null;
      }
    }
  };
};

const JWT = () => {
  const cardOf = getCard();
  const { config } = Store.get('config');
  const extractConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secrets.jwt.access
  };

  return new JWTStrategy(extractConfig, (jwtPayload, done) => {
    const { data, type } = jwtPayload;
    if (data && data.userId && data.clientId && data.role && tokenType.access.is(type)) {
      const Card = cardOf(data.role);
      if (!Card) { return done(null, false); }

      fetchByField(Card, 'id', data.userId)
        .chain(user => user ? Future.of(user) : Future.reject(null))
        .map(user => user.toJSON())
        .map(R.merge({ role: data.role }))
        .fork(error => done(error, false), user => done(null, user));
    } else {
      done(null, false);
    }
  });
};

const local = () => {
  const cardOf = getCard();
  const config = {
    session: false,
    usernameField: 'email',
    passReqToCallback: true,
    passwordField: 'password'
  };

  return new LocalStrategy(config, (req, username, plainPassword, done) => {
    const Card = cardOf(req.params.role);
    if (!Card) { return done(null, false); }

    return fetchAccount(Card, config.usernameField, R.toLower(username))
      .chain(model => model ? Future.of(model) : Future.reject(false))
      .chain(model => {
        const { password, salt } = model.related('credentials');
        return hashBySalt(plainPassword, salt)
          .chain(hash => hash === password ? Future.of(model) : Future.reject(false));
      })
      .map(model => model.toJSON())
      .map(R.merge({ role: req.params.role }))
      .fork(error => done(error, null), model => done(null, model))
  });
};

export const init = () => {
  passport.use('local', local());
  passport.use('jwt', JWT());
};
