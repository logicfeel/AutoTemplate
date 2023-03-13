
const { AutoTemplate } = require('../../../src/auto-template');

// const out1 = new (require('../out1/template').AutoTemplate);

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);

        // out1.init();    // 초기화 처리함

        // this.import('out1', out1);

    }

    ready() {
        // 내부에서 추가함
        // this.helper = out1.helper;
    }
}

exports.AutoTemplate = Template;
