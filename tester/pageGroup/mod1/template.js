
const {AutoTemplate} = require('../../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }
    
    ready() {
        // 구조 만들기
        this.group.add('double', [
            { page: 'p1.asp', context: '{0}group{1}/p1.asp' },
            { page: 'p2.asp', context: '{0}group{1}/p2.asp' },
        ], ['', '']);

        // 페이지 또는 그룹 등록
        this.attachGroup('all', 'P', 'S', ['A1', 'A2']);
        this.attachGroup('double', 'P', 'S', ['A1', 'A2']);
        this.src.add('newP3.asp', this.page['p3.asp']);
    }
}

module.exports = Template;
