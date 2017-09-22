/**
 * @api {put} /api/account Create new account
 * @apiName Create
 * @apiGroup Account
 *
 * @apiParam {String} name User name
 * @apiParam {String} email User email
 * @apiParam {String} password User password

 * @apiSuccess 200 Success
 * @apiError 401 Unauthorized
 */

const v1_0_0 = (req, res, next) => {

};

export const create = {
  '1.0.0': v1_0_0
};
