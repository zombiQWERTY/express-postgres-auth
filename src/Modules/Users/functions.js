import R from 'ramda';
import Future, { node } from 'fluture';
import { byField } from './getters';
import { accountLevel } from './consts';
import { Store } from '../../Start/ConnectionsStore';
import { generateSaltenHash } from '../Hashes/functions';
import { ValidationError, WrapError } from '../../utils/errors';

const saveModel = Model => data => node(done => new Model(data).save().asCallback(done));
const manipulateError = error => Future.reject(new WrapError('ValidationError', error));

const validateEmailUniqueness = email =>
  byField('email', email)
    .chain(user => {
      const error = new ValidationError({
        email: ['Email already exists']
      });

      return user ? Future.reject(error) : Future.of(email);
    });

const setAccountLevel = accountLevel => data => R.merge(data, { accountLevel });

export const create = data =>
  (Model => validateEmailUniqueness(data.email)
    .chain(() => generateSaltenHash(data.password))
    .map(R.merge(data))
    .map(setAccountLevel(accountLevel.get('beginner').key))
    .chain(saveModel(Model)))(Store.get('Models.User'))
    .chainRej(manipulateError);
