import mongoose from 'mongoose-fill';
import moment from 'moment';

import ROLES from '../enums/role';
import StartUpManager from '../manager/StartUpManager';
import { modelCleaner, findNotDeleted } from '../db/utils';
import { ONLINE_OFFSET, EMAIL } from '../consts';

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, 'Email missing or invalid.'],
      validate: {
        validator(v) {
          return EMAIL.regexp.test(v);
        },
        message: '"{VALUE}" is not a valid email!'
      }
    },
    previousID: {
      type: Number
    },
    migrated: {
      type: Boolean,
      default: true
    },
    lastAccess: {
      type: Date,
      default: moment.utc()
    },
    lastLogin: {
      type: Date
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password missing or invalid.']
    },
    salt: {
      type: String,
      trim: true,
      required: true
    },
    isMale: {
      type: Boolean,
      required: true
    },
    about: {
      type: String,
      trim: true,
      default: ''
    },
    birthdate: {
      type: Date,
      validate: {
        validator: function(value) {
          return moment().diff(moment(value, 'DD/MM/YYYY'), 'years') >= 18;
        },
        message: 'Вам ещё нет 18 лет.'
      },
      required: [true, 'Неверный формат, или не указано значение.']
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name missing or invalid.']
    },
    lastName: {
      type: String,
      trim: true,
      default: ''
    },
    username: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: ObjectId,
      ref: 'City',
      required: [true, 'City missing or invalid.']
    },
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    phone: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    avatar: {
      type: ObjectId,
      ref: 'Image',
      default: null
    },
    moderatedAvatar: {
      type: Boolean,
      required: true,
      default: false
    },
    moderatedPhone: {
      type: Boolean,
      required: true,
      default: false
    },
    images: [
      {
        type: ObjectId,
        ref: 'Image'
      }
    ],
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

UserSchema.virtual('isOnline').get(function() {
  return (
    moment(this.lastAccess) > moment.utc().add(-1 * ONLINE_OFFSET, 'minutes')
  );
});

UserSchema.virtual('age').get(function() {
  return moment().diff(this.birthdate, 'years');
});

findNotDeleted(UserSchema);

modelCleaner(UserSchema);

export default StartUpManager.dbConnections.site.model('User', UserSchema);
