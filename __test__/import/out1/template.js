
const {AutoTemplate} = require('../../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);

        // this.
        // console.log('out1');
        
    }
    
    ready() {
        // 구조 만들기
        this.group.add('double', [
            { page: 'p1.html', context: '{0}/group{1}/p1.html' },
            { page: 'p2.html', context: '{0}/group{1}/p2.html' },
        ], ['def1', '_def2']);

        // 페이지 또는 그룹 등록
        this.attachGroup('all', 'P_', '_S', ['A1_', '_A2']);
        this.attachGroup('double', 'P_', '_S', ['AA1_', '_AA2']);
        this.src.add('new_p3.html', this.page['p3.html']);
    }
}

// module.exports = Template;
exports.AutoTemplate = Template;
