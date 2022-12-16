
// const {AutoTemplate} = require('../../src/auto-template');
const T1 = require('../t1/template');
// let t1 = new T1();

class Template extends T1 {
    constructor() {
        super();
        this.dir = __dirname;

        console.log(__filename);
    }
}


// let t1 = new Template();
// t1.build();

module.exports = Template;
