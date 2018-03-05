const bcrypt = require('bcrypt');
const saltRounds = 10;

function validatePassword(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash)
}

function hashPassword(passwordToHash){
    return bcrypt.hashSync(passwordToHash, saltRounds)
}

module.exports = {
    validatePassword: validatePassword,
    hashPassword: hashPassword
}