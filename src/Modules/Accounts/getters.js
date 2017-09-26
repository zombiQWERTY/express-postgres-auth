import R from 'ramda';
import { node } from 'fluture';

export const fetchAccount = R.curry((Card, field, value) =>
  node(done => Card.where(field, value).fetch({ withRelated: ['credentials'] }).asCallback(done)));
