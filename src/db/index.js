import knexQB from 'knex';
import { node } from 'fluture';
import { Store } from '../Modules/Store/Store';

export const createDBConnection = config => knexQB(config);
export const knex = table => table ? Store.get('knex')(table) : Store.get('knex');
export const makeCb = request => node(done => request.asCallback(done));
