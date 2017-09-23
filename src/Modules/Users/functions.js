import R from 'ramda';
import S from 'sanctuary';
import Future, { node } from 'fluture';
import ValidationError from 'error/validation';
import { byField } from './getters';
import { Store } from '../../Start/ConnectionsStore';
import { generateSaltenHash } from '../Hashes/functions';

export const isUniqueEmail = email => byField('email', email).map(R.complement(Boolean));

export const create = data => {
  const Model = Store.get('Models.User');
  const attempt = Future.fold(S.Left, S.Right);

  return Future
    .do(function *() {
      const emailUnique = yield isUniqueEmail(data.email);

      if (emailUnique) {
        const passwordSalt = yield generateSaltenHash(data.password);

        return yield attempt(node(done => new Model(R.merge(data, passwordSalt)).save().asCallback(done)));
      } else {

        return Future.reject(ValidationError([
          { email: ['Email already exists.'] }
        ]));
      }
    });
};
