var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var PasswordHasher = require('../../helper/passwordHasher');

var updateUserPasswordRoute = function (req, res){

    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    //check passwords are equall
    if (req.body.password !== req.body.password_confirmation){
        errorMessage+= "Passwords doesn't match";
    }

    if(errorMessage != "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return
    }

    //create auxiliar user
    var userNewData = {'password':""};
    userNewData.password= PasswordHasher.hashPassword(req.body.password);

    //update
    UserModel.findByIdAndUpdate(req.params.id, userNewData, (error, user) => {
        if(error){
            res.status(500).json({
                status: 500,
                errorInfo: "Failed to update user's password.",
                data: {}
            }).end();
            return
        }
        res.status(204).end();

    });

}

module.exports = updateUserPasswordRoute;