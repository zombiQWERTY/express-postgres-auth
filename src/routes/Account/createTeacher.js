import { createTeacher } from '../../Modules/Accounts/functions';

/**
 * @api {put} /api/account/teacher Create new teacher
 * @apiName CreateStudent
 * @apiGroup Account
 *
 * @apiParam {String} name User's name
 * @apiParam {String} phone User's phone
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 * @apiParam {String} lastname User's last name

 * @apiSuccess 200 Success
 * @apiVersion 1.0.0
 */

const v1_0_0 = (req, res, next) =>
  createTeacher(req.body)
    .map(user => ({ user }))
    .fork(next, res.setRes);

export const create = {
  '1.0.0': v1_0_0
};
