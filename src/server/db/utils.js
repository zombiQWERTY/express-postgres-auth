/**
 * @namespace DBUtils
 */

import R from 'ramda';
import mongooseHidden from 'mongoose-hidden';
import autoIncrement from 'mongoose-auto-increment';
import deepPopulate from 'mongoose-deep-populate';

export const modelCleaner = Schema => {
  Schema.set('toJSON', {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;
      delete ret.password;
      delete ret.salt;
      delete ret.attempts;

      return ret;
    }
  });
  Schema.set('toObject', {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;

      return ret;
    }
  });
  Schema.plugin(mongooseHidden());
};

export const enableDeepPopulate = (Schema, mongoose) => {
  Schema.plugin(deepPopulate(mongoose));
};

export const enableAutoIncrement = (Schema, mongoose, config) => {
  autoIncrement.initialize(mongoose.connection);
  Schema.plugin(autoIncrement.plugin, config);
};

function findNotDeletedFunc(next) {
  this._conditions = R.merge(
    { deleted: { $in: [false, null] } },
    this._conditions
  );
  next();
}

export const findNotDeleted = Schema => {
  Schema.pre('find', findNotDeletedFunc);
  Schema.pre('findOne', findNotDeletedFunc);
  Schema.pre('findOneAndUpdate', findNotDeletedFunc);
  Schema.pre('count', findNotDeletedFunc);
};
