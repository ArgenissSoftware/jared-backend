function checkArgenissFormatEmail(email){
    var errorMessage = "";
    var domain = "@argeniss.com";

    if(!email || email == "" || email.indexOf(domain) < 0){
        errorMessage += `${email}: Email have a format incorrect.`;
    }

    return errorMessage;
}

module.exports = checkArgenissFormatEmail;
