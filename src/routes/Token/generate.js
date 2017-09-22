/**
 * @api {put} /api/token Generate tokens pair by email and password
 * @apiName GeneratePair
 * @apiGroup Token
 *
 * @apiParam {String} email User email
 * @apiParam {String} password User password

 * @apiSuccess {Object} data
 * @apiSuccess {Object} data.tokens Pair of tokens (access and refresh)
 * @apiError 401 Unauthorized
 */

const v1_0_0 = (req, res, next) => {

};

export const generate = {
  '1.0.0': v1_0_0
};
