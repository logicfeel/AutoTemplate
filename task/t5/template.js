
const {AutoTemplate} = require('../../src/auto-template');

class Template extends AutoTemplate {
    constructor() {
        super(__dirname);
    }

    ready() {
        // 구조 만들기
        this.group.add('spring', [
            { page: 'aspPage2.asp', context: '{0}inc/2page{1}.asp' }
        ], ['A', 'B']);

        // 전체 page 출판
        this.attachGroup('all', '_', '__');
        // this.attachGroup('spring', '_', '__', ['AA', 'BB']);

        console.log(1)
    }
}


// let t1 = new Template();
// t1.build();

module.exports = Template;
