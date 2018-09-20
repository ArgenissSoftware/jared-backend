var UserModel = require('../../models/user.model');
var SchemaValidator = require('../../helper/schemaValidator');
var PasswordHasher = require('../../helper/passwordHasher');


var createUser = function(req, res){
    
    var validation = SchemaValidator.userValidation(req.body);
    if(validation.error) {
        res.status(500).json({
            status: 500,
            errorInfo: validation.error,
            data: {}
        }).end();
        return
    }

    
    // check if user exist
    UserModel.find({ $or : [ { email: req.body.email }, { username: req.body.username } ] }, (err, user) => {
        if (user.length > 0) {
            errorHandler(res, "User already exist!")
            return
        }

        var hashPassword = PasswordHasher.hashPassword(req.body.password);

        var newUser = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password: hashPassword,
            active: true
        });

        newUser.save(function (error, fluffy){
            if(error){
                errorHandler(res, "Failed to create new user.")
            }

  	    var token = PasswordHasher.generateToken(newUser);
              res.status(200).json({
                  status: 200,
                  errorInfo: "",
                  data: {
                      message: "User created!",
                      token: token,
                      user: user
                  }
              })
          });
      });
}

function errorHandler(res, errorMessage) {
    res.status(500).json({
        status: 500,
        errorInfo: errorMessage,
        data: {
            message: errorMessage
        }
    })
}

module.exports = createUser;
