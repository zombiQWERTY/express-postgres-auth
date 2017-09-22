import crypto from 'crypto';
import Future from 'fluture';
import { pbkdf2 } from './consts';

export const hashBySalt = (password, salt) => {
  const { iterations, keylen, digestAlgorithm, encoding } = pbkdf2;
  return Future((reject, resolve) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digestAlgorithm, (error, raw) => {
      if (error) { return reject(error); }

      const hash = new Buffer(raw, 'binary').toString(encoding);
      return resolve(hash);
    });
  });
};
