var MailConnection = require('../mailConnection');

//TIP: Nodemailer is unicode friendly ✔
//receiverList is an array of strings, which must as follows:
//  "[NAME SURNAME] email"
function mailSender (receiversList, subject, text, html){

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

    console.log('Sending email to: %s', mailOptions.to);


    mailOptions.subject=subject;
    mailOptions.text=text;
    mailOptions.html=html;
    //this field doesn't need to be the user used for authentication
    mailOptions.from= user;

    console.log('Sending email from %s to %s', mailOptions.from, mailOptions.to);


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return errorMessage= "There was an error while sending the email. Check console log";
        }

        console.log('Email sent: %s', info.messageId);



    });

    console.log(errorMessage);
    return errorMessage;
}


module.exports = {
    mailSender: mailSender
}
