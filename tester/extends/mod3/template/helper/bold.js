var Handlebars          = require('handlebars');

module.exports = function(options) {
        return new Handlebars.SafeString('<div class="mybold">' + options.fn(this) + "</div>");
}; 