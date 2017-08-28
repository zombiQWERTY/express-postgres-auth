import wrap from 'express-async-wrap';

/**
 * @api {get} /api/session Get session info
 * @apiName SessionInfo
 * @apiGroup Session
 *
 * @apiSuccess {Object} user Full user info
 *
 * @apiError 401 Unauthorized
 */
export default wrap(async (req, res, next) => {
    return res.setRes.success({
        status: 200,
        data: { user: req.user }
    });
});
