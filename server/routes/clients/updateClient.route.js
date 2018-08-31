var clientModel = require('../../models/client.model');
var ValidationData = require('../../helper/validationIncomingData');
var SchemaValidator = require('../../helper/schemaValidator');

// UPDATE CLIENT FUNCTION
var updateClient = function(req, res) {
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

    var validation = SchemaValidator.clientValidation(req.body);
    if(validation.error) {
        res.status(500).json({
            status: 500,
            errorInfo: validation.error,
            data: {}
        }).end();
        return
    }

    var clientNewData = {}

    for(field in req.body){
        if(field != 'id'){
            clientNewData[field] = req.body[field]
        }
    }

    clientModel.findByIdAndUpdate(req.params.id, clientNewData, (error, client) => {
        if(error){
          res.status(500).json({
              status: 500,
              errorInfo: "Failed to update client.",
              data: {}
          }).end();
            return
        }

        res.status(200).json({
            status: 200,
            errorInfo: "",
            data: {
                message: "Client updated!"
            }
        })
    })
}

module.exports = updateClient;
