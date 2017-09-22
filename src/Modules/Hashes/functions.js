import crypto from 'crypto';
import Future from 'fluture';
import { pbkdf2 } from './consts';

export const hashBySalt = (password, salt) => Future((reject, resolve) => {
  const { iterations, keylen, digestAlgorithm, encoding } = pbkdf2;
  crypto.pbkdf2(password, salt, iterations, keylen, digestAlgorithm, (error, raw) => {
    if (error) { return reject(error); }

    const hash = new Buffer(raw, 'binary').toString(encoding);
    return resolve(hash);
  });
});

export const generateSaltenHash = plain => Future((reject, resolve) => {
  const { salten, encoding } = pbkdf2;
  crypto.randomBytes(salten, (error, raw) => {
    if (error) { return reject(error); }

    const salt = raw.toString(encoding);
    hashBySalt(plain, salt).fork(reject, password => resolve({ password, salt }));
  });
});
