
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
        this.attachGroup('all', 'P', 'S', ['A1', 'A2']);
        this.attachGroup('double', 'P', 'S', ['AA1', 'AA2']);
        this.src.add('newP3.html', this.page['p3.html']);
        this.src.add(this.page['p3.html']); // 즉시 등록
    }
}

module.exports = Template;
