import { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';

export const getModel = () => Store.get('Models.User');

export const byField = (field, value) => {
  const Model = getModel();
  return node(done => Model.where(field, value).fetch().asCallback(done));
};
