import bookshelfMask from 'bookshelf-mask';
import bookshelfParanoia from 'bookshelf-paranoia';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'users',
    softDelete: true,
    hasTimestamps: true,
    hidden: ['password', 'salt']
  }, {
    schema: [
      fields.EmailField('name'),
      fields.EmailField('email'),
      fields.EncryptedStringField('password'),
      fields.BooleanField('active')
    ]
  });

  Store.add('Models.User', Model);
};
