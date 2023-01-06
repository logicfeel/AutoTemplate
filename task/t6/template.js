
const {AutoTemplate} = require('../../src/auto-template');
const T5 = require('../t5/template');
let t5 = new T5();

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);

        this.import('temp5', t5);
    }
}


// let t1 = new Template();
// t1.build();

module.exports = Template;
