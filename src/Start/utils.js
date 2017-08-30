import mkdirp from 'mkdirp';
import Future from 'fluture';

export const createFolder = path => Future((reject, resolve) =>
  mkdirp(path, error => error ? reject(error) : resolve()));
