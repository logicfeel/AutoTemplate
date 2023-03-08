
const {AutoTemplate} = require('../../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }
    
    ready() {
        // 구조 만들기
        this.group.add('double', [
            { page: 'p1.html', context: '{0}group{1}/p1.html' },
            { page: 'p2.html', context: '{0}group{1}/p2.html' },
        ], ['', '']);

        // 페이지 또는 그룹 등록
        this.attachGroup('all', 'P_', '_S', ['FP_', '_SS']);    // 아규먼트 무시됨
        this.attachGroup('double', 'P__', '__S', ['FP__', '__FS']);
        this.src.add('new_P3.html', this.page['p3.html']);
        this.src.add(this.page['p3.html']); // 즉시 등록
    }
}

module.exports = Template;
