
const {AutoTemplate} = require('../../../src/auto-template');
const Out1 = require('../out1/template');
const out1 = new Out1();

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
        // this.dir = _dirname;
        this.import('out1', out1);
    }
    
    ready() {
        // 페이지 또는 그룹 등록
        this.attachGroup(this.ns['out1'].group['all'], 'P_', '_S', ['A1_', '_A2']);
        this.attachGroup(this.namespace['out1'].group['double'], 'P_', '_S', ['AA1_', '_AA2']);
        this.src.add('ready_p2.html', this.ns['out1'].page['p2.html']);
        this.src.add('ready_p3.html', this.ns['out1'].page['p3.html']);

        this.group.add('new_all', this.ns['out1'].group['all']);
        this.attachGroup('new_all', 'pp_', '_ss', ['a1_', '_a2']);  // a1_, _a2 는 all 에서 무시됨
        this.group.add(this.namespace['out1'].group['double']);
        // console.log(0)
    }
}

module.exports = Template;
