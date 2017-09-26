import R from 'ramda';
import Future from 'fluture';
import jwt from 'jsonwebtoken';
import { tokenType } from './consts';
import { Store } from '../../Start/ConnectionsStore';

const generateExpiration = (timeout, measure) => timeout + measure;

const sign = (data, type) => {
  const { config } = Store.get('config');
  const secret = config.secrets.jwt;
  const options = { expiresIn: generateExpiration(type.value, 'd') };

  return Future.of(jwt.sign(R.merge({ data }, { type: type.key }), secret, options))
    .map(token => `Bearer ${token}`);
};

export const generateTokenPair = data =>
  Future.both(sign(data, tokenType.access), sign(data, tokenType.refresh))
    .map(([access, refresh]) => ({ access, refresh }))
    .map(tokens => ({ tokens }));
