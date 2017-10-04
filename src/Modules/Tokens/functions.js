import ms from 'ms';
import R from 'ramda';
import moment from 'moment';
import Future from 'fluture';
import jwt from 'jsonwebtoken';
import { tokenType } from './consts';
import { knex, makeCb } from '../../db/index';
import { Store } from '../Store/Store';
import { ValidationError } from '../../Helpers/Errors/classes';

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
    .map(accessToken =>
      createSignature('Bearer', expiresIn, { accessToken }));
};

const signRefreshToken = data => {
  const { config } = Store.get('config');
  const secret = config.secrets.jwt.refresh;
  const expiresIn = tokenType.refresh.value;
  const options = { expiresIn };
  const payload = R.merge({ data }, { type: tokenType.refresh.key });

  return Future.of(jwt.sign(payload, secret, options))
    .map(refreshToken =>
      createSignature('Bearer', expiresIn, { refreshToken }));
};

const saveRefreshToken = payload => {
  const { userId, clientId } = payload;

  const saveNewToken = t => knex('refreshTokens').transacting(t).insert(payload);
  const disableOldTokens = t => knex('refreshTokens').transacting(t).where({ userId, clientId }).del();
  const doTransaction = () => knex().transaction(t => disableOldTokens(t).tap(saveNewToken(t)));

  return makeCb(doTransaction());
};

const generateAccessToken = signAccessToken;
const generateRefreshToken = (tokenScheme, clientId, userId, role) =>
  signRefreshToken({ userId, role })
    .chain(token => saveRefreshToken({
      userId,
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

const validateRefreshTokenStatus = ({ clientId, refreshToken, userId, role }) =>
  makeCb(knex('refreshTokens').where({ clientId, refreshToken, userId }))
    .chain(res => res.length
      ? Future.of({ clientId, refreshToken, userId, role })
      : Future.reject(new ValidationError({
          refreshToken: ['Token not found.']
        })));

const parseToken = token => {
  const re = /(\S+)\s+(\S+)/;
  const matches = token.match(re);
  return matches
    ? Future.of({ scheme: matches[1], value: matches[2] })
    : Future.reject(new ValidationError({
        token: ['Invalid signature']
      }));
};

export const verifyRefreshToken = (refreshToken, clientId) =>
  Future.of(clientId)
    .chain(clientId => clientId
      ? Future.of(clientId)
      : Future.reject(new ValidationError({
          clientId: ['Unique client id not found.']
        })))
    .chain(() => parseToken(refreshToken))
    .chain(({ value }) => verifyToken(value, tokenType.refresh.key))
    .chain(({ data }) =>
      validateRefreshTokenStatus({ clientId, refreshToken, userId: data.userId, role: data.role }));

export const generateTokenPair = data =>
  Future
    .do(function *() {
      if (!data.clientId) {
        throw new ValidationError({
          clientId: ['Unique client id not found.']
        });
      }

      const accessToken = yield generateAccessToken(data);
      const { refreshToken } = yield generateRefreshToken('Bearer', data.clientId, data.userId, data.role);
      return R.merge(accessToken, { refreshToken });
    });
