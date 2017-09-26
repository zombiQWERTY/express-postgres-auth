import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');
  const UserCard = Store.get('Models.Card.User');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'users',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    userCard_id: function () {
      return this.belongsTo(UserCard);
    }
  }, {
    schema: [
      fields.BooleanField('active'),
      fields.IntField('userCard_id', { required: true }),
      fields.StringField('salt', { required: true }),
      fields.StringField('password', { required: true }),
    ]
  });

  Store.add('Models.User', Model);
};
