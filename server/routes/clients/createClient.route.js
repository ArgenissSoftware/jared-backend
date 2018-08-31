var clientModel = require('../../models/client.model');
var SchemaValidator = require('../../helper/schemaValidator');

// CREATE CLIENT FUNCTION
var createClient = function(req, res) {
    
    var validation = SchemaValidator.clientValidation(req.body);
    if(validation.error) {
        res.status(500).json({
            status: 500,
            errorInfo: validation.error,
            data: {}
        }).end();
        return
    }

    // check if client exist
    clientModel.find({ $or : [ { name: req.body.name } ] }, (err, client) => {
        if (client.length > 0) {
            errorHandler(res, "Client already exist!")
            return
        }

        var newClient = new clientModel({
          name: req.body.name,
          employees: req.body.employees,
          active: true
        });

        newClient.save(function (error, fluffy){
            if(error){
                errorHandler(res, "Failed to create new client.")
            }

            res.status(200).json({
                status: 200,
                errorInfo: "",
                data: {
                    message: "Client created!"
                }
            })
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
    })
}

module.exports = createClient;
