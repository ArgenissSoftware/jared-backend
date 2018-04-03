var clientModel = require('../../models/client.model');
var ValidationData = require('../../helper/validationIncomingData');

// DELETE CLIENT FUNCTION
var deleteClient = function(req, res) {
    var fieldToValidate = ["name"];
    var errorMessage = ValidationData(fieldToValidate, req.body);

    if (errorMessage != "") {
        res.status(500).json({
            status: 500,
            errorInfo: errorMessage,
            data: {}
        }).end();
        return
    }

    clientModel.deleteOne({id : req.body.id}, (error, client) => {
        if (error) {
          res.status(500).json({
              status: 500,
              errorInfo: "Failed to delete client",
              data: {
                message: "Failed to delete client"
              }
          }).end();
          return
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: {
            message: "Client deleted!"
          }
        }).end();
    })
}

module.exports = deleteClient;
