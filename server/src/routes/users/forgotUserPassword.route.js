var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');
var MailSender= require("../../helper/mailSender");
const crypto = require('crypto');



var forgotUserPassword = function(req,res){
    var fieldToValidate = ["email"];
    var errorMessage = ValidationData(fieldToValidate, req.query);

    if(errorMessage != "") {
        errorHandler(res,errorMessage);
    }

    crypto.randomBytes(20, function(err, buffer) {

        var token = buffer.toString('hex');

        //86400000 ms = 24hs
        UserModel.findOneAndUpdate({ email: req.query.email },  { reset_password_token: token, reset_password_expires: Date.now() + 60 * 60 * 24 * 1000 }, (err, user) => {

            if(err) {
                errorHandler(res, "User not found");
            }

            //this URL must be a front-end URL. For testing purposes, I'm sending the id and the token which can be used to reset the password
            var resetPasswordURL= 'http://localhost:3000/api/users/reset_password/ ID: ' + user._id +" Token: " + "-" +  token + "-";

            errorMessage= MailSender.mailSender(
                [`${user.name} ${user.surname} ${user.email}`],
                'resetPassword',
                {
                    name: user.name,
                    resetPasswordURL: resetPasswordURL
                }
            );

            if (errorMessage){
                errorHandler(res, errorMessage);
            }

            let response = {
                status: 200,
                errorInfo: "",
                data: {
                    message: "An email was sent to the account you provided"
                }
            }

            res.status(200).json(response).end();

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
    }).end();
}

module.exports = forgotUserPassword;

