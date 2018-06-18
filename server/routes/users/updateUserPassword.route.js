var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var PasswordHasher = require('../../helper/passwordHasher');

var updateUserPassword = function (req, res){

    var fieldToValidate = ["id"];
    var errorMessage = "";
    var userId="";


    if (req.body.hasOwnProperty('id')){
        errorMessage=ValidationData(fieldToValidate, req.body);
        userId =req.body.id;
    }
    else{
        errorMessage=ValidationData(fieldToValidate, req.params);
        userId=req.params.id;
    }

    //check passwords are equal
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
    var userNewData = {'password':`${req.body.password}` };
    userNewData.password= PasswordHasher.hashPassword(req.body.password);

    //update
    UserModel.findByIdAndUpdate(userId, userNewData, (error, user) => {
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

module.exports=updateUserPassword;