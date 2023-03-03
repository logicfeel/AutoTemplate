
const {AutoTemplate} = require('../../../src/auto-template');

class Template extends AutoTemplate {
    isRename = true;   // 변경함
    constructor() {
        super(__dirname);
        
    }
}

// module.exports = Template;
exports.AutoTemplate = Template;

