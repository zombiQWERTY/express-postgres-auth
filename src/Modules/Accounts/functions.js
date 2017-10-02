import R from 'ramda';
import Future, { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';
import { generateSaltenHash } from '../Hashes/functions';
import { accountLevel as accountLevels } from '../Cards/consts';
import { ValidationError, manipulateError } from '../../utils/errors';

const findModel = R.curry((Model, field, value) =>
  node(done => Model.where(field, value).fetch().asCallback(done)));

const validateEmailUniqueness = (Model, email) =>
  findModel(Model, 'email', email)
    .chain(user => {
      const error = new ValidationError({
        email: ['Email already exists.']
      });

      return user ? Future.reject(error) : Future.of(email);
    });

const makeTransaction = (Account, Card, cardData, relationField) => {
  const saveAccount = (saltenHash, t) => ({ attributes }) =>
    new Account(R.merge({ [relationField]: attributes.id }, saltenHash))
      .save(null, { transacting: t });

  const saveCard = t =>
    new Card(cardData)
      .save(null, { transacting: t });

  const saveProfile = saltenHash => t =>
    saveCard(t)
      .tap(saveAccount(saltenHash, t));

  return R.compose(Card.transaction, saveProfile);
};

const processProfile = (transaction, email, password) => {
  const StudentCard = Store.get('Models.Cards.Student');
  const TeacherCard = Store.get('Models.Cards.Teacher');

  const checkUniqueness = () =>
    Future.both(validateEmailUniqueness(StudentCard, email),
      validateEmailUniqueness(TeacherCard, email));

  return checkUniqueness(email)
    .chain(() => generateSaltenHash(password))
    .map(({ hash, salt }) => ({ password: hash, salt }))
    .chain(saltAndHash => node(done => transaction(saltAndHash).asCallback(done)))
    .map(user => user.toJSON())
    .chainRej(manipulateError('ValidationError'));
};

export const createStudent = data => {
  const Student = Store.get('Models.Student');
  const StudentCard = Store.get('Models.Cards.Student');

  const cardData = R.pipe(
    R.omit(['password']),
    R.merge({
      accountLevel: accountLevels.student[0].value
    })
  );

  const transaction = makeTransaction(Student, StudentCard, cardData(data), 'studentCard_id');
  return processProfile(transaction, data.email, data.password);
};

export const createTeacher = data => {
  const Teacher = Store.get('Models.Teacher');
  const TeacherCard = Store.get('Models.Cards.Teacher');

  const cardData = R.pipe(
    R.omit(['password']),
    R.merge({
      accountLevel: accountLevels.teacher[0].value
    })
  );

  const transaction = makeTransaction(Teacher, TeacherCard, cardData(data), 'teacherCard_id');
  return processProfile(transaction, data.email, data.password);
};
