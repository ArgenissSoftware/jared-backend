function checkArgenissFormatEmail(email){
    const re =  /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(argeniss)\.com$/;

    return re.test(email);
}

module.exports = checkArgenissFormatEmail;
