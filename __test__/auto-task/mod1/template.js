
const {AutoTemplate} = require('../../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);

        this.name = 'auto-task';
    }
}

// module.exports = Template;
exports.AutoTemplate = Template;
