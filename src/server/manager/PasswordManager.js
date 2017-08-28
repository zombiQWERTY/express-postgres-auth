import mongoose from 'mongoose-fill';

import UserManager from '../manager/UserManager';
import PasswordError from '../errors/PasswordError';

const ObjectId = mongoose.Types.ObjectId;

class PasswordManager {
  static async saveNewPassword(userId, password) {
    if (!ObjectId.isValid(userId)) {
      throw new PasswordError(PasswordError.messages.invalidUserId, {
        type: 'saveNewPassword'
      });
    }

    if (!password) {
      throw new PasswordError(PasswordError.messages.emptyPassword, {
        type: 'saveNewPassword'
      });
    }

    let user;
    try {
      user = await UserManager.getUserModelById(userId);
    } catch (reason) {
      throw new PasswordError(PasswordError.messages.userNotFound, {
        type: 'saveNewPassword',
        reason
      });
    }

    try {
      await this._setPassword(user, password);
    } catch (reason) {
      throw new PasswordError(PasswordError.messages.setPasswordError, {
        type: 'saveNewPassword',
        reason
      });
    }
  }

  static _setPassword(userModel, password) {
    return new Promise((resolve, reject) => {
      if (!UserManager.validatePassword(password)) {
        return reject(
          new PasswordError(PasswordError.messages.invalidPasswordFormat, {
            type: 'setPassword'
          })
        );
      }

      return userModel.setPassword(password, async (reason, user) => {
        if (reason) {
          return reject(reason);
        }

        return resolve();
      });
    });
  }
}

export default PasswordManager;
