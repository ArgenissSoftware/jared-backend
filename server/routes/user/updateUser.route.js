var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var PasswordHasher = require('../../helper/passwordHasher');

var updateUser = function(req, res){
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if(errorMessage !== "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return;
    }

    var userNewData = {};

    for(var field in req.body){
        if(field != 'id'){
            userNewData[field] = req.body[field];
        }
    }

    UserModel.findByIdAndUpdate(req.body.id, userNewData, (error, user) => {
        if(error){
            errorHandler(res, "Failed to update user.");
            return;
        }

        res.status(200).json({
            status: 200,
            errorInfo: "",
            data: {
                message: "User updated!"
            }
        });
    });
};

function errorHandler(res, errorMessage) {
    res.status(500).json({
        status: 500,
        errorInfo: errorMessage,
        data: {
            message: errorMessage
        }
    });
}

module.exports = updateUser;
