import { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';

export const getModel = () => Store.get('Models.Account');

export const byField = (field, value) => {
  const Model = getModel();
  return node(done => Model.where(field, value).fetch().asCallback(done));
};
