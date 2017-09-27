import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');
  const User = Store.get('Models.User');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'refreshTokens',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    user_id: function () {
      return this.hasOne(User);
    }
  }, {
    schema: [
      fields.BooleanField('active'),
      fields.IntField('user_id', { required: true }),
      fields.DateField('expiresIn', { required: true }),
      fields.StringField('clientId', { required: true }),
      fields.StringField('refreshToken', { required: true })
    ]
  });

  Store.add('Models.Token.Refresh', Model);
};
