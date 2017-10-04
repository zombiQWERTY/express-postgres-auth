import R from 'ramda';
import Future from 'fluture';
import { knex, makeCb } from '../../db/index';
import { generateSaltenHash } from '../Hashes/functions';
import { ValidationError } from '../../Helpers/Errors/classes';
import { makeRules, runValidator } from '../../Helpers/CheckIt/functions';
import { studentAccountLevel, teacherAccountLevel } from '../Cards/consts';

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
    UTCOffset: ['required', 'integer'],
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
    yield makeCb(knex('students').insert(accountData));
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
    yield makeCb(knex('teachers').insert(accountData));
    return R.omit(['password', 'salt'], accountData);
  });
