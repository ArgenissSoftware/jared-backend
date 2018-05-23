var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var PasswordHasher = require('../../helper/passwordHasher');
var ValidationArgenissFormat = require('../../helper/validationArgenissEmail');

var createUser = function(req, res){
    var fieldToValidate = ["email", "password", "username"];
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
            errorInfo: "Failed to create new user. Email with invalid format",
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

            res.status(200).json({
                status: 200,
                errorInfo: "",
                data: {
                    message: "User created!"
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
