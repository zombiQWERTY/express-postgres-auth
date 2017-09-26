import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');
  const TeacherCard = Store.get('Models.Card.Teacher');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'teachers',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    card: function () {
      return this.hasOne(TeacherCard);
    }
  }, {
    schema: [
      fields.BooleanField('active'),
      fields.IntField('card', { required: true }),
      fields.StringField('salt', { required: true }),
      fields.StringField('password', { required: true }),
    ]
  });

  Store.add('Models.Teacher', Model);
};
