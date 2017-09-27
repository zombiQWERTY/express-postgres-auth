import ms from 'ms';
import R from 'ramda';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import Future, { node } from 'fluture';
import { tokenType } from './consts';
import { ValidationError, manipulateError } from '../../utils/errors';
import { Store } from '../../Start/ConnectionsStore';

const convertExpiresInToDate = expiresIn => moment.utc().add(ms(expiresIn), 'ms').toDate();
const createSignature = (tokenScheme, expiresIn, token) =>
  R.merge({ tokenScheme, expiresIn: convertExpiresInToDate(expiresIn) }, token);

const signAccessToken = data => {
  const { config } = Store.get('config');
  const secret = config.secrets.jwt.access;
  const expiresIn = tokenType.access.value;
  const options = { expiresIn };
  const payload = R.merge({ data }, { type: tokenType.access.key });

  return Future.of(jwt.sign(payload, secret, options))
    .map(accessToken => createSignature('Bearer', expiresIn, { accessToken }));
};

const signRefreshToken = data => {
  const { config } = Store.get('config');
  const secret = config.secrets.jwt.refresh;
  const expiresIn = tokenType.refresh.value;
  const options = { expiresIn };
  const payload = R.merge({ data }, { type: tokenType.refresh.key });

  return Future.of(jwt.sign(payload, secret, options))
    .map(refreshToken => createSignature('Bearer', expiresIn, { refreshToken }));
};

const saveRefreshToken = payload => {
  const RefreshToken = Store.get('Models.Token.Refresh');
  const { user_id, clientId } = payload;

  const saveNewToken = t => new RefreshToken(payload).save(null, { transacting: t });
  const disableOldTokens = t => new RefreshToken({ user_id, clientId }).destroy(null, { transacting: t });
  const doTransaction = () => RefreshToken.transaction(t => disableOldTokens(t).tap(saveNewToken(t)));

  return node(done => doTransaction().asCallback(done));
};

const generateAccessToken = user_id => signAccessToken({ id: user_id });
const generateRefreshToken = (tokenScheme, clientId, user_id) =>
  signRefreshToken({ id: user_id })
    .chain(token => saveRefreshToken({
      user_id,
      clientId,
      refreshToken: R.join(' ', [tokenScheme, token.refreshToken]),
      expiresIn: token.expiresIn
    })
      .map(() => token));

const verifyToken = (token, type) => Future((reject, resolve) => {
  const { config } = Store.get('config');
  const secret = config.secrets.jwt[type];
  const options = {};

  jwt.verify(token, secret, options, (jwtError, payload) =>
    jwtError ? reject(jwtError) : resolve(payload));
});

const validateRefreshTokenStatus = payload =>
  Future.of(Store.get('Models.Token.Refresh'))
    .chain(RefreshToken => node(done => new RefreshToken(payload).fetch().asCallback(done)))
    .chain(token => token ? Future.of(token) : Future.reject(new ValidationError({
      refreshToken: ['Token not found']
    })));

const parseToken = token => {
  const re = /(\S+)\s+(\S+)/;
  const matches = token.match(re);
  return matches ? Future.of({ scheme: matches[1], value: matches[2] }) : Future.reject(new ValidationError({
    token: ['Invalid signature']
  }));
};

export const verifyRefreshToken = (refreshToken, clientId) =>
  parseToken(refreshToken)
    .chain(({ value }) => verifyToken(value, tokenType.refresh.key))
    .chain(({ data }) => validateRefreshTokenStatus({ clientId, refreshToken, user_id: data.id }))
    .chainRej(manipulateError('ValidationError'))
    .map(token => token.toJSON())
    .map(({ user_id }) => user_id);

export const generateTokenPair = R.curry((clientId, user_id) => Future
  .do(function *() {
    const accessToken = yield generateAccessToken(user_id);
    const { refreshToken } = yield generateRefreshToken('Bearer', clientId, user_id);
    return R.merge(accessToken, { refreshToken });
  })
  .chainRej(manipulateError(null)));
