var Handlebars          = require('handlebars');

module.exports = function(options) {
        return new Handlebars.SafeString('<div class="mybold-OVER">' + options.fn(this) + "</div>");
}; 