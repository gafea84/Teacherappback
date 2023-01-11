const Handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');

const templateStr           = fs.readFileSync(path.resolve(__dirname, 'errorpassword.hbs')).toString('utf8');
const errorPasswordTemplate = Handlebars.compile(templateStr, { noEscape: true });

const getErrorPasswordHtml = (data) => {
    return errorPasswordTemplate(data);
}

module.exports = { getErrorPasswordHtml };