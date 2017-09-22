import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'users',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt']
  }, {
    schema: [
      fields.BooleanField('active'),
      fields.StringField('name', { required: true, maxLength: 32 }),
      fields.EmailField('email', { required: true, maxLength: 64 }),
      fields.StringField('salt', { required: true }),
      fields.StringField('password', { required: true })
    ]
  });

  Store.add('Models.User', Model);
};
