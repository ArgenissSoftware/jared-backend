var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var updateUserPassword = require('./updateUserPassword.route');

var resetUserPassword = function (req, res) {

    var fieldToValidate = ["id", "token", "password", "password_confirmation"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if(errorMessage != "") {
        errorHandler(res,errorMessage);
    }

    UserModel.findByIdAndUpdate(req.body.id , {reset_password_expires: undefined, reset_password_token: undefined}, (error, user) => {
        if(error) {
            errorHandler(res,"User not found");
        }
        else if (req.body.token !== user.reset_password_token){
            errorHandler(res,"Invalid token");
        }
        else if (user.reset_password_expires < Date.now()){
            errorHandler(res,"Expired token");
        }

        else{
            updateUserPassword(req,res);
        }


    })


}

function errorHandler(res, errorMessage) {
    res.status(500).json({
        status: 500,
        errorInfo: errorMessage,
        data: {
            message: errorMessage
        }
    }).end();
}

module.exports = resetUserPassword;


