import R from 'ramda';
import Future, { node } from 'fluture';
import { knex } from '../../db/index';
import { generateSaltenHash } from '../Hashes/functions';
import { ValidationError } from '../../Helpers/Errors/classes';
import { makeRules, runValidator } from '../../Helpers/CheckIt/functions';
import { studentAccountLevel, teacherAccountLevel } from '../Cards/consts';

export const findModel = (table, column, value) =>
  node(done => knex(table).where(column, value).asCallback(done));

const validateEmailUniqueness = (table, email) =>
  findModel(table, 'email', email)
    .chain(res =>
      res.length > 0
        ? Future.reject(new ValidationError({
            email: ['The email address is already in use.']
          }))
        : Future.of(email));

const validateRegistrationRules = () =>
  makeRules({
    firstName: ['required', 'string'],
    email: ['required', 'string', 'email'],
    password: ['required', 'string', 'maxLength:255', 'minLength:6']
  });

export const createStudent = data =>
  Future.do(function *() {
    const validData = yield runValidator(validateRegistrationRules(), data);
    yield Future.both(
      validateEmailUniqueness('students', data.email),
      validateEmailUniqueness('teachers', data.email));

    const { salt, hash } = yield generateSaltenHash(validData.password);
    const password = hash;
    const accountLevel = studentAccountLevel[0].value;

    const accountData = R.merge(validData, { salt, password, accountLevel });
    yield node(done => knex('students').insert(accountData).asCallback(done));
    return R.omit(['password', 'salt'], accountData);
  });

export const createTeacher = data =>
  Future.do(function *() {
    const validData = yield runValidator(validateRegistrationRules(), data);
    yield Future.both(
      validateEmailUniqueness('students', data.email),
      validateEmailUniqueness('teachers', data.email));

    const { salt, hash } = yield generateSaltenHash(validData.password);
    const password = hash;
    const accountLevel = teacherAccountLevel[0].value;

    const accountData = R.merge(validData, { salt, password, accountLevel });
    yield node(done => knex('teachers').insert(accountData).asCallback(done));
    return R.omit(['password', 'salt'], accountData);
  });
