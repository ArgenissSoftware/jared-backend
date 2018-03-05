var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');

var getUser = function(req, res){
    var fieldToValidate = ["email"];
    var errorMessage = ValidationData(fieldToValidate, req.query);

    if(errorMessage != "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return
    }

    UserModel.find({ email: req.query.email }, '-password', (err, user) => {
        let response = {
            status: 200,
            errorInfo: "",
            data: user ? user : {}
        }

        res.status(200).json(response).end();
    });
}

module.exports = getUser;