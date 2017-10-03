import R from 'ramda';
import { node } from 'fluture';

export const fetchLanguages = R.curry((Card, field, value) =>
  node(done => Card.where(field, value).fetch().asCallback(done)));
