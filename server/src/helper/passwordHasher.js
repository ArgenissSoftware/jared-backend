const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

function validatePassword(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
}

function hashPassword(passwordToHash){
    return bcrypt.hashSync(passwordToHash, saltRounds);
}

function generateToken(user){
    let u = {
      username: user.username,
      email: user.email,
      roles: user.roles.map(r => r.name),
      _id: user._id.toString()
    };

    return jwt.sign(u, process.env.JWT_SECRET, {
    	expiresIn: 60 * 60 * 24
    });
}

module.exports = {
    validatePassword: validatePassword,
    hashPassword: hashPassword,
    generateToken: generateToken
};
