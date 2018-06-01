const nodemailer = require('nodemailer');

//CREDENTIALS
//user is only for authentication and does not affect the email content (from field)
const user= 'ee4p6d6bz7p5fp6w@ethereal.email';
const password= '3CHv9qA6HAFBfrmmEW';


//set credentials and server
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: `${user}`,
        pass: `${password}`
    }
});

module.exports = {
    user: user,
    transporter:transporter
}