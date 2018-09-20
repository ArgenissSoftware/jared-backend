var mongoose = require('mongoose');

var clientModel = mongoose.Schema({
    name: String,
    contactName: String,
    email: String,
    address: String,
    url: String,
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    active: Boolean
});

module.exports = mongoose.model( "ClientModel", clientModel );
