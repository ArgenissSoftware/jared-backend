var clientModel = require('../../models/client.model');
var ValidationData = require('../../helper/validationIncomingData');

// GET CLIENT BY NAME FUNCTION 
var getClientByName = function(req, res) {
    var fieldToValidate = ["name"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if (errorMessage != ""){
        res.status(500).json({
          status: 500,
          errorInfo: errorMessage,
          data: {}
        })
        return
    }

    clientModel.findOne({name: req.body.name}, (error, client) => {
        if (error){
          res.status(500).json({
            status: 500,
            errorInfo: "Failed to find client.",
            data: {
              message: "Failed to find client."
            }
          })
          return
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: client ? client : {}
        }).end();

    })
}

module.exports = getClientByName;
