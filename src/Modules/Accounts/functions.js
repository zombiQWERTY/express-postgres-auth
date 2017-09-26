import R from 'ramda';
import Future, { node } from 'fluture';
import { userAccountLevel } from '../Cards/consts';
import { Store } from '../../Start/ConnectionsStore';
import { generateSaltenHash } from '../Hashes/functions';
import { ValidationError, WrapError } from '../../utils/errors';

const findModel = Model => (field, value) => node(done => Model.where(field, value).fetch().asCallback(done));
const manipulateError = error => Future.reject(new WrapError('ValidationError', error));

const validateEmailUniqueness = R.curry((Model, email) => {
  const findBy = findModel(Model);

  return findBy('email', email)
    .chain(user => {
      const error = new ValidationError({
        email: ['Email already exists']
      });

      return user ? Future.reject(error) : Future.of(email);
    });
});

export const create = data => {
  const Account = Store.get('Models.User');
  const Card = Store.get('Models.Cards.User');

  const accountLevel = userAccountLevel.get('beginner').key;

  const saveAccount = R.curry((saltenHash, t, { attributes }) => {
    const accountData = R.merge({ userCard_id: attributes.id }, saltenHash);
    return new Account(accountData).save(null, { transacting: t });
  });

  const saveCard = t => {
    const cardData = R.pipe(
      R.omit(['password']),
      R.merge({ accountLevel })
    );

    return new Card(cardData(data)).save(null, { transacting: t });
  };

  const saveProfile = R.curry((saltenHash, t) => saveCard(t).tap(saveAccount(saltenHash, t)));
  const transaction = R.compose(Card.transaction, saveProfile);

  return validateEmailUniqueness(Card, data.email)
    .chain(() => generateSaltenHash(data.password))
    .map(({ hash, salt }) => ({ password: hash, salt }))
    .chain(saltenHash => node(done => transaction(saltenHash).asCallback(done)))
    .chainRej(manipulateError);
};
