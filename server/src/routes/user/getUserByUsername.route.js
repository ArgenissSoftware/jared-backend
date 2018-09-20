var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');

var getUser = function(req, res){
    var fieldToValidate = ["username"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if(errorMessage !== "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return;
    }

    UserModel.findOne({ username: req.params.username }, '-password', (err, user) =>{
        if(err) {
            res.status(500).json({
                status: 500,
                errorInfo: errorMessage,
                data: {}
            }).end();
            return;
        }

        let response = {
            status: 200,
            errorInfo: "",
            data: user ? user : {}
        };

        res.status(200).json(response).end();
    });
};

module.exports = getUser;
