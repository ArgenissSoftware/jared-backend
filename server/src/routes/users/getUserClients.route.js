var UserModel = require('../../models/user.model');
var ValidationData = require('../../helper/validationIncomingData');

var getUserClients = function(req, res){
    var fieldToValidate = ["id"];
    var errorMessage = ValidationData(fieldToValidate, req.params);

    if(errorMessage != "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return
    }

    UserModel.findById( req.params.id , 'clients', (err, clients) =>{
        if(err) {
            res.status(500).json({
                status: 500,
                errorInfo: errorMessage,
                data: {}
            }).end();
            return
        }

        let response = {
            status: 200,
            errorInfo: "",
            data: clients ? clients.clients : {}
        }

        res.status(200).json(response).end();
    }).populate('clients');


}

module.exports = getUserClients;