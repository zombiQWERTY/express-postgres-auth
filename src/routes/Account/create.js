import { create as createUser } from '../../Modules/Accounts/functions';

/**
 * @api {put} /api/account/:group Create new account for student or teacher
 * @apiName Create
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
  createUser(req.body, req.params.group)
    .map(user => ({ user }))
    .fork(next, res.setRes);

export const create = {
  '1.0.0': v1_0_0
};
