import { verifyRefreshToken, generateTokenPair } from '../../Modules/Tokens/functions';

/**
 * @api {patch} /api/token Generate new tokens pair by refresh token
 * @apiName RegeneratePair
 * @apiGroup Token
 *
 * @apiHeader {String} X-Request-ID Unique client identifier (ex.: device fingerprint)
 *
 * @apiParam {String} refreshToken Refresh token
 *
 * @apiSuccess {Object} payload
 * @apiSuccess {Object} payload.tokenScheme
 * @apiSuccess {Object} payload.expiresIn In UTC
 * @apiSuccess {Object} payload.accessToken
 * @apiSuccess {Object} payload.refreshToken
 * @apiVersion 1.0.0
 */

const v1_0_0 = (req, res, next) =>
  verifyRefreshToken(req.body.refreshToken, req.headers['x-request-id'])
    .chain(({ userId, role }) => generateTokenPair({ clientId: req.headers['x-request-id'], role, userId }))
    .fork(next, res.setRes);

export const regenerate = {
  '1.0.0': v1_0_0
};
