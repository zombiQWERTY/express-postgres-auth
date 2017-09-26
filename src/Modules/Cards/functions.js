import { node } from 'fluture';

export const fetchByField = (Card, field, value) =>
  node(done => Card.where(field, value).fetch().asCallback(done));

