// let fs, path;
// var AutoTask, autoTask


// import {describe, expect, test} from '@jest/globals';
const AutoTask                = require('../src/auto-task').AutoTask;
const fs                = require('fs');
// import {describe, expect, test} from '@jest/globals';
// const {describe, expect, test}                    = require('jest');

describe("기본 테스트", () => {
  it("템플릿 part.data.helper", () => {
    const dirname = __dirname + '/base/mod1';
    const fullPath = dirname + '/src/one.html'
    let data;

    // dirname = __dirname + '/base/mod1';
    // fullPath = dirname + '/src/one.html'
    
    autoTask = AutoTask.create(dirname);
    
    
    autoTask.do_clear();
    
    autoTask.do_publish();
    
    expect(fs.existsSync(fullPath)).toBeTruthy();
    
    data = fs.readFileSync(fullPath,'utf-8');
    
    expect(data).toMatch('@part/inc/footer@');
    expect(data).toMatch('@entity.Table=1@');
    expect(data).toMatch('@part/inc/header@');
    expect(data).toMatch('@entity.Tables.[0]:10@');
    expect(data).toMatch('@part/inc/content@');
    expect(data).toMatch('@<div class="mybold">BOLD</div>@');

  });
  
  it("template.js >> newTemplate.js 이름 변경", () => {
    // ...
  });
  it("template.js >> newTemplate.js 이름 변경 2", () => {
    // ...
  });
});