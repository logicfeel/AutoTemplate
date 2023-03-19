
const {AutoTemplate} = require('../mod2/finalTemplate');

class Template extends AutoTemplate {
    constructor() {
        super();
        this.dir = __dirname;
    }
    
    ready() {
        // // 구조 만들기
        this.group.add('double', [
            { page: 'p1.html', context: '{0}/group{1}/p1.html' },
            { page: 'p2.html', context: '{0}/group{1}/p2.html' },
        ], ['def1', '_def2']);
        
        // // 페이지 또는 그룹 등록
        this.attachGroup(this.group['all'], 'pre_', '_suf', [], 'ready');
    }
}

// module.exports = Template;
exports.AutoTemplate = Template;
