const html_to_pdf = require('html-pdf');

async function convertHtmlToPDF(html, options) {
    return new Promise((resolve, reject) => {
        html_to_pdf.create(html, options).toBuffer(function(err, buffer){
            if(err){
                reject(err);
            } else {
                resolve(buffer);
            }
        })
    });

}

module.exports = { convertHtmlToPDF }