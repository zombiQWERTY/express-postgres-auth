import crypto from 'crypto';
import Future from 'fluture';
import { pbkdf2 } from './consts';

export const hashBySalt = (plain, salt) =>
  Future((reject, resolve) => {
    const { iterations, keylen, digestAlgorithm, encoding } = pbkdf2;
    crypto.pbkdf2(plain, salt, iterations, keylen, digestAlgorithm, (error, raw) => {
      if (error) { return reject(error); }

      const hash = new Buffer(raw, 'binary').toString(encoding);
      return resolve(hash);
    });
  });

export const generateSaltenHash = plain =>
  generateSalt(plain)
    .chain(salt =>
      hashBySalt(plain, salt)
        .map(hash => ({ hash, salt }))
    );

export const generateSalt = plain =>
  Future((reject, resolve) => {
    const { salten, encoding } = pbkdf2;
    crypto.randomBytes(salten, (error, raw) => {
      if (error) { return reject(error); }

      resolve(raw.toString(encoding));
    });
  });
