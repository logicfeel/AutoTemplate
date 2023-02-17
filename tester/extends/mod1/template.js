
// const {AutoTemplate} = require('../../../src/auto-template');
// const Mod2 = require('../mod2/template');
const {AutoTemplate} = require('../mod2/template');
// const Out1 = require('../out1/template');
// const out1 = new Out1();

class Template extends AutoTemplate {
    constructor() {
        super();
        this.dir = __dirname;
        // this.import('out1', out1);
    }
    
    ready() {
        // 구조 만들기
        this.group.add('double', [
            { page: 'p1.html', context: '{0}group{1}/p1.html' },
            { page: 'p2.html', context: '{0}group{1}/p2.html' },
        ], ['__', '_']);
        
        // 페이지 또는 그룹 등록
        this.attachGroup(this.group['all'], 'P_', '_S', ['A1_', '_A2']);
        this.attachGroup(this.group['double'], 'P_', '_S', ['AA1_', '_AA2']);
        this.src.add('ready_p2.html', this.page['p2.html']);
        this.src.add('ready_p3.html', this.page['p3.html']);
        // console.log(0)
    }
}

// module.exports = Template;
exports.AutoTemplate = Template;
