import { create as createUser } from '../../Modules/Accounts/functions';

/**
 * @api {put} /api/account Create new account
 * @apiName Create
 * @apiGroup Account
 *
 * @apiParam {String} name User name
 * @apiParam {String} email User email
 * @apiParam {String} password User password

 * @apiSuccess 200 Success
 * @apiVersion 1.0.0
 */

const v1_0_0 = (req, res, next) =>
  createUser(req.body)
    .map(user => ({ user }))
    .fork(next, res.setRes);

export const create = {
  '1.0.0': v1_0_0
};
