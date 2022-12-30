
// const {AutoTemplate} = require('../../src/auto-template');
const T1 = require('../t1/template');
// let t1 = new T1();

class Template extends T1 {
    constructor() {
        super();
        this.dir = __dirname;
        // this.import('temp1', t1);
        this.onInit = (t, a) => {console.log('onInit 이벤트 '+ t.dir)};
        this.onInited = (t, a) => {console.log('onInited 이벤트 '+ t.dir)};
        this.onBuild = (t, a) => {console.log('onBuild 이벤트 '+ t.dir)};
        this.onBuilded = (t, a) => {console.log('onBuilded 이벤트 '+ t.dir)};
    }
    // 오버라이딩
    ready() {
        this.src['page-one.html'].onCompile = (s) => { console.log('onCompile src 이벤트'+s.saveName) };
        this.src['page-one.html'].onCompiled = (s) => { console.log('onCompiled src 이벤트'+s.saveName) };

        this.src['page-one.html'].savePath = this.dir +'/page-save.html';

        this.part.add('/nsa', ''); // 오류가 발생해야함
        // this.src.add('ns', '');
        // this.part.add('ns/', '');
        // this.part.add('/ns', '');
        // this.part.add('ns/', '');

    }
}


// let t1 = new Template();
// t1.build();

module.exports = Template;
