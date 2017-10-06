import R from 'ramda';
import moment from 'moment';
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

const validateEmailUniquenessBoth = email =>
  Future.both(validateEmailUniqueness('students', email),
    validateEmailUniqueness('teachers', email));

const validateRegistrationRules = () =>
  makeRules({
    phone: ['string'],
    familyName: ['string'],
    firstName: ['required', 'string'],
    UTCOffset: ['required', 'integer'],
    email: ['required', 'string', 'email'],
    password: ['required', 'string', 'maxLength:255', 'minLength:6']
  });

const createTimestamps = date => R.fromPairs([['createdAt', date], ['updatedAt', date]]);

export const createStudent = data =>
  Future.do(function *() {
    const validData = yield runValidator(validateRegistrationRules(), data);
    yield validateEmailUniquenessBoth(data.email);

    const { salt, hash } = yield generateSaltenHash(validData.password);
    const password = hash;
    const accountLevel = studentAccountLevel[0].value;
    const timestamps = createTimestamps(moment.utc());

    const accountData = R.mergeAll([validData, timestamps, { salt, password, accountLevel }]);
    yield makeCb(knex('students').insert(accountData));
    return R.omit(['password', 'salt'], accountData);
  });

// TODO: remove this after MVP showing
const saveTeacher = payload => {
  const saveNewTeacher = t =>
    knex('teachers') // First
      .transacting(t)
      .insert(payload)
      .returning('id');

  const saveTeacherLevel = t => resp => // Third
    knex('teacherLevelLanguageCEFRJunction')
      .transacting(t)
      .insert([
        {
          canTeach: true,
          languageCEFR: 2,
          teacher: resp[0],
          difficultyLevel: 1
        },
        {
          canTeach: true,
          languageCEFR: 2,
          teacher: resp[0],
          difficultyLevel: 2
        },
        {
          canTeach: true,
          languageCEFR: 2,
          teacher: resp[0],
          difficultyLevel: 3
        },
        {
          canTeach: true,
          languageCEFR: 1,
          teacher: resp[0],
          difficultyLevel: 6
        }
      ]);

  const saveTeacherCEFR = t => resp => // Second
    knex('teacherLanguageCEFRJunction')
      .transacting(t)
      .insert([
        {
          CEFR: 7, // Fluent
          language: 1, // Русский
          teacher: resp[0]
        },
        {
          CEFR: 6, // Proficiency
          language: 2, // Английский
          teacher: resp[0]
        }
      ])
      .returning('teacher')
      .tap(saveTeacherLevel(t));

  const doTransaction = () => knex().transaction(t => saveNewTeacher(t).tap(saveTeacherCEFR(t)));
  return makeCb(doTransaction());
};

export const createTeacher = data =>
  Future.do(function *() {
    const validData = yield runValidator(validateRegistrationRules(), data);
    yield validateEmailUniquenessBoth(data.email);

    const { salt, hash } = yield generateSaltenHash(validData.password);
    const password = hash;
    // const accountLevel = teacherAccountLevel[0].value;
    const accountLevel = teacherAccountLevel[40].value;
    const timestamps = createTimestamps(moment.utc());

    const accountData = R.mergeAll([validData, timestamps, { salt, password, accountLevel }]);
    // yield makeCb(knex('teachers').insert(accountData));
    yield saveTeacher(R.merge(accountData, { lessonsType: 'all', fluentLanguage: 1 }));
    return R.omit(['password', 'salt'], accountData);
  });
