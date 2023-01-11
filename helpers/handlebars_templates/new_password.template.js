const Handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');

const templateStr         = fs.readFileSync(path.resolve(__dirname, 'newpassword.hbs')).toString('utf8');
const newPasswordTemplate = Handlebars.compile(templateStr, { noEscape: true });

const getNewPasswordHtml = (data) => {
    return newPasswordTemplate(data);
}

module.exports = { getNewPasswordHtml };