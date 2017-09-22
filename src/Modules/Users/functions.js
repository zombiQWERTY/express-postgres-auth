import R from 'ramda';
import Future, { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';
import { generateSaltenHash } from '../Hashes/functions';

export const create = data => Future
  .do(function *() {
    const Model = Store.get('Models.User');
    const passwordSalt = yield generateSaltenHash(data.password);
    return yield node(done => new Model(R.merge(data, passwordSalt)).save().asCallback(done));
  });
