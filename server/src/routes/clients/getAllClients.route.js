var clientModel = require('../../models/client.model');

var getAllClients = function(req, res) {
    clientModel.find({ active: true }, (error, client) => {
        if (error) {
          res.status(500).json({
            status: 500,
            errorInfo: "Failed to get all clients.",
            data: {}
          }).end();
          return
        }

        res.status(200).json({
          status: 200,
          errorInfo: "",
          data: client ? client : {}
        }).end();
    })
}

module.exports = getAllClients;
