import { createStudent } from '../../Modules/Accounts/functions';

/**
 * @api {put} /api/account/student Create new student
 * @apiName CreateStudent
 * @apiGroup Account
 *
 * @apiParam {String} name User's name
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 * @apiParam {Number} UTCOffset User's UTC-timezone offset
 * @apiParam {String} [familyName] User's family name
 * @apiParam {String} [phone] User's phone

 * @apiSuccess 200 Success
 * @apiVersion 1.0.0
 */

const v1_0_0 = (req, res, next) =>
  createStudent(req.body)
    .map(user => ({ user }))
    .fork(next, res.setRes);

export const create = {
  '1.0.0': v1_0_0
};
