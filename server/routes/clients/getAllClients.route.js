var clientModel = require('../../models/client.model');

var getAllClients = function(req, res) {
    clientModel.find((error, client) => {
        if (error) {
          res.status(500).json({
            status: 500,
            errorMessage: "Failed to get all clients."
            data: {}
          }).end();
          return
        }

        res.status(200).json({
          status: 200,
          errorMessage: "",
          data: client ? client : {}
        }).end();
    })
}

module.exports = getAllClients;
