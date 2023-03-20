var Handlebars          = require('handlebars');

module.exports = function(options) {
        return new Handlebars.SafeString('<div class="mySharp">' + options.fn(this) + "</div>");
}; 