const velocity = require('velocity-template-engine');


const renderTemplate = (template, data) => {
    let rendered = velocity.render(template, data);
    return rendered;
}

module.exports = renderTemplate;