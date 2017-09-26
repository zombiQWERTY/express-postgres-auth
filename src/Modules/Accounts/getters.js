import R from 'ramda';
import { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';

export const getModel = () => Store.get('Models.User');

export const byField = (field, value) => {
  const Model = getModel();
  return node(done => Model.where(field, value).fetch().asCallback(done));
};

export const fetchAccount = R.curry((Card, field, value) =>
  node(done => Card.where(field, value).fetch({ withRelated: ['credentials'] }).asCallback(done)));
