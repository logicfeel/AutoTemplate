
const {AutoTemplate} = require('../../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }
}

// module.exports = Template;
exports.AutoTemplate = Template;
