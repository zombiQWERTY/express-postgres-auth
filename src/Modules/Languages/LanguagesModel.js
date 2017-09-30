import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());

  const Model = DB.Model.extend({
    tableName: 'languages'
  }, {
    schema: [
      fields.StringField('code', { required: true }),
      fields.StringField('local', { required: true }),
      fields.StringField('international', { required: true })
    ]
  });

  Store.add('Models.Languages', Model);
};
