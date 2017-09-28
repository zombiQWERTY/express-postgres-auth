import R from 'ramda';
import Future, { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';
import { generateSaltenHash } from '../Hashes/functions';
import { accountLevel as accountLevels } from '../Cards/consts';
import { ValidationError, manipulateError } from '../../utils/errors';

const findModel = Model => (field, value) => node(done => Model.where(field, value).fetch().asCallback(done));

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

export const normalizeGroup = group => R.toUpper(group.charAt(0)) + R.slice(1, Infinity, group);

export const create = (data, lowerGroup) => {
  if (!R.keys(accountLevels).includes(lowerGroup)) {
    return Future.reject(new ValidationError({
      group: ['Invalid group.']
    }));
  }

  const group = normalizeGroup(lowerGroup);

  const Account = Store.get(`Models.${group}`);
  const Card = Store.get(`Models.Cards.${group}`);

  const accountLevel = accountLevels[lowerGroup][0].value;
  const accountCardFieldName = `${lowerGroup}Card_id`;

  const saveAccount = R.curry((saltenHash, t, { attributes }) => {
    const accountData = R.merge({ [accountCardFieldName]: attributes.id }, saltenHash);
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
    .chain(saltAndHash => node(done => transaction(saltAndHash).asCallback(done)))
    .map(user => user.toJSON())
    .chainRej(manipulateError('ValidationError'));
};
