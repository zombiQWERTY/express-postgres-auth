import UserModel from '../models/User';

class UserManager {
  static login(req, userData) {
    return new Promise((resolve, reject) => {
      req.logIn(userData, { session: true }, function(error) {
        if (error) { return reject(error); }
        return resolve(req.user);
      });
    });
  }

  static logout(req) {
    req.logout();
  }

  static getById(userId) {
    return UserModel.findById(userId).select('-updatedAt -favorites').exec();
  }

  static updateModel(_id, $set, multi = false) {
    return UserModel.update({ _id }, { $set }, { multi });
  }
}

export default UserManager;
