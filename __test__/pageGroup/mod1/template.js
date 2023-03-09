
const {AutoTemplate} = require('../../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }
    
    ready() {
        // 그룹 정의
        this.group.add('double', [
            { page: 'p1.html', context: '{0}/group{1}/p1.html' },
            { page: 'p2.html', context: '{0}/group{1}/p2.html' },
        ], ['', '']);
        // 페이지, 그룹 생성
        this.attachGroup('all', 'pre_', '_suf', [], 'ready');    // 아규먼트 무시됨
        this.attachGroup('double', 'pre_', '_suf', ['arg1', '_arg2'], 'ready');
        this.src.add('ready/new_p3.html', this.page['p3.html']);
        this.src.add(this.page['p3.html']); // 즉시 등록
    }
}

module.exports = Template;
