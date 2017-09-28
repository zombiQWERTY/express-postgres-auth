import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');
  const StudentCard = Store.get('Models.Cards.Student');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'students',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    studentCard_id: function () {
      return this.belongsTo(StudentCard);
    }
  }, {
    schema: [
      fields.BooleanField('active'),
      fields.IntField('studentCard_id', { required: true }),
      fields.StringField('salt', { required: true }),
      fields.StringField('password', { required: true })
    ]
  });

  Store.add('Models.Student', Model);
};
