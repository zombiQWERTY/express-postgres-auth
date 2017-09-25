import R from 'ramda';
import Future, { node } from 'fluture';
import { ValidationError } from '../../utils/errors';
import { byField } from './getters';
import { Store } from '../../Start/ConnectionsStore';
import { generateSaltenHash } from '../Hashes/functions';

export const validateEmailUniqueness = email => byField('email', email)
  .chain(user => {
    const error = ValidationError({
      email: {
        errors: ['Email already exists.'],
        detail: email
      }
    });

    return user ? Future.reject(error) : Future.of(email);
  });

export const create = data => {
  const Model = Store.get('Models.User');

  return validateEmailUniqueness(data.email)
    .chain(() => generateSaltenHash(data.password))
    .map(R.merge(data))
    .chain(data => node(done => new Model(data).save().asCallback(done)))
};
