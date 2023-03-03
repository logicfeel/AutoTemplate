// let fs, path;
// var AutoTask, autoTask


// import {describe, expect, test} from '@jest/globals';
const AutoTask                = require('../src/auto-task').AutoTask;
const fs                = require('fs');
// import {describe, expect, test} from '@jest/globals';
// const {describe, expect, test}                    = require('jest');

// let 
const dirname = __dirname + '/base/mod1';

describe.only("기본 검사 : do_clear >> do_publish ", () => {

  beforeEach(() => {
    console.log('1 - beforeEach :: 태스크 실행 ')
    autoTask = AutoTask.create(dirname);
    autoTask.do_clear();
    autoTask.do_publish();
    const aaa = 1;
    bbb = 2
  });

  it("스냅샷 검사", () => {
    // const dirname = __dirname + '/base/mod1';
    const fullPath = dirname + '/src/one.html'
    let data;

    // dirname = __dirname + '/base/mod1';
    // fullPath = dirname + '/src/one.html'
    
    // autoTask = AutoTask.create(dirname);
    
  // console.log(aaa);
  // console.log(bbb);
  
    // autoTask.do_clear();
    
    // autoTask.do_publish();
    
    // 파일 유무
    expect(fs.existsSync(fullPath)).toBeTruthy();
    
    data = fs.readFileSync(fullPath,'utf-8');
    // 스냅샷 비교    
    expect(data).toMatchSnapshot();
    // expect(data).toMatch('@part/inc/footer@');
    // expect(data).toMatch('@entity.Table=1@');
    // expect(data).toMatch('@part/inc/header@');
    // expect(data).toMatch('@entity.Tables.[0]:10@');
    // expect(data).toMatch('@part/inc/content@');
    // expect(data).toMatch('@<div class="mybold">BOLD</div>@');

    let test = autoTask.entry.src['one.html'].getObject();
    let test2 = JSON.stringify(test, null, '\t');
    expect(test2).toMatchSnapshot();
    // expect(JSON.stringify(this._buildFile, null, '\t')).toMatchSnapshot();
    

    /**
     * 
     */

    // describe("sub.. sub", () => {
    //   // ...
    // });


    
  });
  
  // describe("sub.. sub", () => {
  //   // ...
  //   it("template.js >> newTemplate.js 이름 변경 2", () => {
  //     // ...
  //   });
  // });

  // it("template.js >> newTemplate.js 이름 변경", () => {
  //   // ...
  // });
  // it("template.js >> newTemplate.js 이름 변경 2", () => {
  //   // ...
  // });
});

describe("sub.. sub", () => {
  // ...
  it("template.js >> newTemplate.js 이름 변경 2", () => {
    // ...
  });
  describe("sub.. sub", () => {
    // ...
    it("template.js >> newTemplate.js 이름 변경 2", () => {
      // ...
    });
  });

});