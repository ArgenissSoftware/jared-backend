var UserModel = require('../../models/user.model');

var getAllUsers = function(req, res){
    UserModel.find({ active: true }, '-password', (err, user) =>{
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
            data: user ? user : {}
        }

        res.status(200).json(response).end();
    });
}

module.exports = getAllUsers;