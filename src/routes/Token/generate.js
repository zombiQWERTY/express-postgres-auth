import { generateTokenPair } from '../../Modules/Tokens/functions';

/**
 * @api {put} /api/token/:role Generate tokens pair by email and password for role (teacher|student)
 * @apiName GeneratePair
 * @apiGroup Token
 *
 * @apiHeader {String} X-Request-ID Unique client identifier (ex.: device fingerprint)
 *
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 *
 * @apiSuccess {Object} payload
 * @apiSuccess {Object} payload.tokenScheme
 * @apiSuccess {Object} payload.expiresIn In UTC
 * @apiSuccess {Object} payload.accessToken
 * @apiSuccess {Object} payload.refreshToken
 * @apiVersion 1.0.0
 */

const v1_0_0 = (req, res, next) =>
  generateTokenPair({ clientId: req.headers['x-request-id'], role: req.user.role, userId: req.user.id })
    .fork(next, res.setRes);

export const generate = {
  '1.0.0': v1_0_0
};
