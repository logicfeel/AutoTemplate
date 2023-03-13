
const { AutoTemplate } = require('../../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }
}

exports.AutoTemplate = Template;
