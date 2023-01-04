
const {AutoTemplate} = require('../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }

    ready() {
        // 전체 page 출판
        // this.attachGroup('all', '_', '__');
    }
}


// let t1 = new Template();
// t1.build();

module.exports = Template;
