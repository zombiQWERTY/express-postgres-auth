import R from 'ramda';
import Checkit from 'checkit';
import Future, { node } from 'fluture';
import { knex } from '../../db/index';
import { generateSaltenHash } from '../Hashes/functions';
import { accountLevel as accountLevels } from '../Cards/consts';

export const findModel = (table, field, value) =>
  node(done => knex(table).where(field, value).asCallback(done));

const validateEmailUniqueness = (table, email) =>
  findModel(table, 'email', email)
    .chain(res =>
      res.length > 0
        ? Future.reject(new Checkit.ValidationError('The email address is already in use.'))
        : Future.of(email));

const validateRegistrationRules = () =>
  new Checkit({
    firstName: ['required', 'string'],
    email: ['required', 'string', 'email'],
    password: ['required', 'string', 'maxLength:255', 'minLength:6']
  });

const runValidator = (rules, data) => Future.tryP(() => rules.run(data));

export const createStudent = data =>
  Future.do(function *() {
    const validData = yield runValidator(validateRegistrationRules(), data);
    yield validateEmailUniqueness('students', data.email);

    const { salt, hash } = yield generateSaltenHash(validData.password);
    const password = hash;
    const accountLevel = accountLevels.student[0].value;

    const accountData = R.merge(validData, { salt, password, accountLevel });
    yield node(done => knex('students').insert(accountData).asCallback(done)); // TODO: handle errors
    return R.omit(['password', 'salt'], accountData);
  });

export const createTeacher = data =>
  Future.do(function *() {
    const validData = yield runValidator(validateRegistrationRules(), data);
    yield validateEmailUniqueness('teachers', data.email);

    const { salt, hash } = yield generateSaltenHash(validData.password);
    const password = hash;
    const accountLevel = accountLevels.teacher[0].value;

    const accountData = R.merge(validData, { salt, password, accountLevel });
    yield node(done => knex('teachers').insert(accountData).asCallback(done)); // TODO: handle errors
    return R.omit(['password', 'salt'], accountData);
  });
