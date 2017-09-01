/**
 * @api {get} /api/session Get session info
 * @apiName SessionInfo
 * @apiGroup Session
 *
 * @apiSuccess {Object} user Full user info
 *
 * @apiError 401 Unauthorized
 */
export default (req, res, next) => {
  // User.fetch().then(function(user) {
  //   console.log(user);
  // }).catch(function(err) {
  //   console.error(err);
  // });
  return res.setRes.success({
    status: 200,
    data: { user: req.user }
  });
};
