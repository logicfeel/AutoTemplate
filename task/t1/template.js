
const {AutoTemplate} = require('../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }
}


let t1 = new Template();
t1.build();