const fs        = require('fs');
const path      = require('path');
const AutoTask  = require('../src/auto-task').AutoTask;
const dirname   = __dirname + '/pageGroup/mod1';

/**
 * 강제 초기화
 * 출판
 * 그룹파일 여부 및 검사
 * 
 */

describe("task :: do_clear()", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
    it("- 파일 유무 : src/one.html(X)", () => {
        const fullPath = dirname + '/src/one.html';
        expect(fs.existsSync(fullPath)).toBeFalsy();
    });
});

describe("task :: do_publish()", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_publish();
    });
    // it("- 파일 유무 : src/one.html", () => {
    //     const fullPath = dirname + '/src/one.html';
    //     expect(fs.existsSync(fullPath)).toBeTruthy();
    // });
    // it("- 파일 비교 : src/one.html", () => {
    //     const fullPath = dirname + '/src/one.html';
    //     const data = fs.readFileSync(fullPath,'utf-8');
    //     expect(fs.existsSync(fullPath)).toBeTruthy();
    //     expect(data).toMatchSnapshot();
    // });
    // describe("속성 ", () => {
    //     it("- data : entity.json", () => {
    //         const prop = changeFakePath(autoTask.entry.data['entity'].getObject());
    //         expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
    //     });
    //     it("- helper : bold.js", () => {
    //         const prop = changeFakePath(autoTask.entry.helper['bold'].getObject());
    //         expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
    //     });
    //     it("- part : inc/content.hbs", () => {
    //         const prop = changeFakePath(autoTask.entry.part['inc/content'].getObject());
    //         expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
    //     });
    //     it("- part : inc/foote.hbs", () => {
    //         const prop = changeFakePath(autoTask.entry.part['inc/footer'].getObject());
    //         expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
    //     });
    //     it("- part : inc/header.hbs", () => {
    //         const prop = changeFakePath(autoTask.entry.part['inc/header'].getObject());
    //         expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
    //     });
    //     it("- src : one.html.hbs", () => {
    //         const prop = changeFakePath(autoTask.entry.src['one.html'].getObject());
    //         expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
    //     });
    // });
    it("AA", () => {})
});