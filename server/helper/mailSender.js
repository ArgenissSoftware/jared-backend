var MailConnection = require('../mailConnection');
const Email = require('email-templates');

//TIP: Nodemailer is unicode friendly ✔
//receiverList is an array of strings, which must as follows:
//  "[NAME SURNAME] email"
function mailSender (receiversList, template, templateParamsArray){

    var errorMessage = '';
    var mailOptions={};
    var transporter = MailConnection.transporter;
    var user= MailConnection.user;

    //check we have at least one destination mail, and put the first into mailOptions
    if(receiversList.length > 0){
        mailOptions.to= receiversList[0];
    }
    else {
        return errorMessage = 'Destination mail not provided';

    }

    //get the rest of destinations if any
    receiversList.slice(1).forEach(function (receiver){
        mailOptions.to= mailOptions.to + ", " + receiver;
    });

    //in case user's name and surname are "undefined"
    mailOptions.to= mailOptions.to.replace(/undefined/g,'');

    //this field doesn't need to be the user used for authentication
    mailOptions.from= user;

    console.log('Sending email from %s to %s', mailOptions.from, mailOptions.to);

    const email = new Email({
        message: mailOptions,
        send:true,
        transport: transporter,
        views: {
            root: './public/email',
            options: {
                extension: 'ejs'
            }
        }
    });

    email.send({
            template: 'resetPassword',
            locals: templateParamsArray
        })
        .then(console.log)
        .catch(console.error);

    return errorMessage;
}


module.exports = {
    mailSender: mailSender
}

