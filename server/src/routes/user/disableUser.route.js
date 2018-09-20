var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var PasswordHasher = require('../../helper/passwordHasher');

var disableUser = function(req, res){
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.body);
    
    if(errorMessage != "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return
    }

    UserModel.findByIdAndUpdate(req.body.id, { active: false }, (error, user) => {
        if(error){
            errorHandler(res, "Failed to delete user.")
            return
        }
        
        res.status(200).json({
            status: 200,
            errorInfo: "",
            data: {
                message: "User deleted!"
            }
        })
    })    
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

module.exports = disableUser;