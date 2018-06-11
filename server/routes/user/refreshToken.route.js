var UserModel = require('../../models/user.model');
var PasswordHasher = require('../../helper/passwordHasher');
const jwt = require('jsonwebtoken');

var refreshToken = function(req, res) {
  var token = req.body.token || req.query.token || req.headers.authorization;
  if (!token) {
    return res.status(401).json({message: 'Invalid Token'});
  }
  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(401).json({message: 'Invalid Token or secret'});
    }
    UserModel.findById({
      '_id': user._id
    }, function(err, usr) {
      if (err) {
        res.status(500).json({
            status: 500,
            errorInfo: "Invalid user or token",
            data: {}
        }).end();
        return;
      }
      var token = PasswordHasher.generateToken(usr);
      res.status(200).json({
        status: 200,
        errorInfo: "",
        data: {
          message: "Refresh Token OK",
          token: token,
          user: user
        }
      });
    });
  });
};

module.exports = refreshToken;
