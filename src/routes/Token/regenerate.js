/**
 * @api {patch} /api/token Generate new tokens pair by refresh token
 * @apiName RegeneratePair
 * @apiGroup Token
 *
 * @apiParam {String} refreshToken Refresh token

 * @apiSuccess {Object} data
 * @apiSuccess {Object} data.tokens New pair of tokens (access and refresh)
 * @apiError 401 Unauthorized
 */

const v1_0_0 = (req, res, next) => {
  res.setRes(req.user);
};

export const regenerate = {
  '1.0.0': v1_0_0
};
