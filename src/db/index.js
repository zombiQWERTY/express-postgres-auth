import knexQB from 'knex';
import { Store } from '../Start/Store';

export const createDBConnection = config => knexQB(config);
export const knex = table => table ? Store.get('knex')(table) : Store.get('knex');
