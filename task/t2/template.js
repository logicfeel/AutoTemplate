
const {AutoTemplate} = require('../../src/auto-template');
const T1 = require('../t1/template');
let t1 = new T1();

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);

        this.import('temp1', t1);

        this.dir = __dirname;   // 중복 등록

        console.log(1)
    }
}


// let t1 = new Template();
// t1.build();

module.exports = Template;
