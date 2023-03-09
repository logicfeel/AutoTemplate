
const {AutoTemplate} = require('../../../src/auto-template');
// const Out1 = require('../out1/template');
// const out1 = new Out1();
const out1 = new (require('../out1/template').AutoTemplate);

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
        // this.dir = _dirname;
        this.import('out1', out1);
    }
    
    ready() {
        // 그룹 정의(등록)
        this.group.add('new_all', this.ns['out1'].group['all']);
        this.group.add(this.namespace['out1'].group['double']);
        // 페이지, 그룹 생성
        this.attachGroup('new_all', 'pre_', '_suf', [], "ready");
        this.attachGroup(this.namespace['out1'].group['double'], 'pre_', '_suf', ['arg1', '_arg2'], "ready");
        this.src.add('ready/new_p3.html', this.ns['out1'].page['p3.html']);
        this.src.add(this.ns['out1'].page['p3.html']);
    }
}

// module.exports = Template;
exports.AutoTemplate = Template;
