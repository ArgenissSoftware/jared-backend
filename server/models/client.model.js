var mongoose = require('mongoose');

var clientModel = mongoose.Schema({
    name: String,
    employees: [{
        type: Number,
        ref: 'User'
    }],
    active: Boolean
});

module.exports = mongoose.model( "ClientModel", clientModel );
