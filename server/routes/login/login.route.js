var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var PasswordHasher = require('../../helper/passwordHasher');
var ValidationArgenissFormat = require('../../helper/validationArgenissEmail');

var login = function(req, res){
    var fieldToValidate = ["email", "password"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if(errorMessage != "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return
    }

    //check format email
    var errorEmailFormat = ValidationArgenissFormat(req.body.email);

    if(!errorEmailFormat) {
        res.status(400).json({
            status: 400,
            errorInfo: "Failed to login. Email with invalid format",
            data: {}
        }).end();
        return
    }

    // check if user exist
    var query = UserModel.find({$or: [{ email: req.body.email }, { username: req.body.email }]}, (err, result) => {
        let user = null
        if(result.length > 0){
          user = result[0]
        }
        if (!user) {
            errorHandler(res, "Failed to login. User doesn't exist!")
            return
        }

        if(!user.active){
            errorHandler(res, "Failed to login. User disabled")
            return
        }

        var isCorrectPassword = PasswordHasher.validatePassword(req.body.password, user.password)

        if (!isCorrectPassword) {
            errorHandler(res, "Failed to login. Invalid password!")
            return
        }

        res.status(200).json({
            status: 200,
            errorInfo: "",
            data: {
                message: "Login correct!"
            }
        })
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

module.exports = login;
