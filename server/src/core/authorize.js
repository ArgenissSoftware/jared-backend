
function isString (value) {
  return typeof value === 'string'
}


/**
 * Role authorization middleware
 *
 * @param  {...any} allowed
 */
module.exports = function (required) {
  if (isString(required)) {
    required = [[required]]
  } else if (isArray(required) && required.every(isString)) {
    required = [required]
  }

  const _middleware = function _middleware (req, res, next) {

    const user = req.user;

    if (!user) {
      return res.status(401).json({message: "Logged out"});
    }

    const roles = user.roles;

    var sufficient = required.some(required => {
      return required.every(role => roles.indexOf(role) !== -1)
    })
    if (!sufficient) {
      res.status(403).json({message: "Forbidden"})
    } else {
      next();
    }
  }

  return _middleware
}