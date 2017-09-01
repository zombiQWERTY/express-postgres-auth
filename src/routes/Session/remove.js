import UserManager from '../../manager/UserManager';

/**
 * @api {delete} /api/session Remove session
 * @apiName SessionRemove
 * @apiGroup Session
 *
 * @apiPermission Authorized users
 *
 * @apiSuccess {Data} Data status information
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Bad Request (if no data provided or other errors)
 */
export default (req, res, next) => {
    try {
        UserManager.logout(req);
    } catch (error) {
        return next(error);
    }

    return res.setRes.success({
        status: 200,
        data: { message: 'Successful logout.' }
    });
};
