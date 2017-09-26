import Future from 'fluture';
import jwt from 'jsonwebtoken';
import { tokenType } from './consts';
import { Store } from '../../Start/ConnectionsStore';

const generateExpiration = (timeout, measure) => timeout + measure;

const sign = (data, timeout) => {
  const { config } = Store.get('config');
  const secret = config.secrets.jwt;
  const options = { expiresIn: generateExpiration(timeout, 'd') };

  return Future.of(jwt.sign(data, secret, options))
    .map(token => `JWT ${token}`);
};

export const generateToken = (data, type) => sign({ data, type }, tokenType[type].value).map(token => ({ token }));
// export const generateTokenPair = (data, type) => sign({ data, type }, tokenType[type].value).map(token => ({ token }));
