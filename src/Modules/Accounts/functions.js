import R from 'ramda';
import moment from 'moment';
import Future from 'fluture';
import { knex, makeCb } from '../../db/index';
import { generateSaltenHash } from '../Hashes/functions';
import { ValidationError } from '../../Helpers/Errors/classes';
import { makeRules, runValidator } from '../../Helpers/CheckIt/functions';

export const findModel = (table, column, value) =>
  makeCb(knex(table).where(column, value));

const validateEmailUniqueness = (table, email) =>
  findModel(table, 'email', email)
    .chain(res =>
      res.length === 0
        ? Future.of(email)
        : Future.reject(new ValidationError({
            email: ['The email address is already in use.']
          })));

const validateRegistrationRules = () =>
  makeRules({
    phone: ['string'],
    familyName: ['string'],
    firstName: ['required', 'string'],
    email: ['required', 'string', 'email'],
    password: ['required', 'string', 'maxLength:255', 'minLength:6']
  });

const createTimestamps = date => R.fromPairs([['createdAt', date], ['updatedAt', date]]);

export const createUser = data =>
  Future.do(function *() {
    const validData = yield runValidator(validateRegistrationRules(), data);
    yield validateEmailUniqueness('users', data.email);

    const { salt, hash } = yield generateSaltenHash(validData.password);
    const password = hash;
    const timestamps = createTimestamps(moment.utc());

    const accountData = R.mergeAll([validData, timestamps, { salt, password }]);
    yield makeCb(knex('users').insert(accountData));
    return R.omit(['password', 'salt'], accountData);
  });
