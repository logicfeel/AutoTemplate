const fs        = require('fs');
const path      = require('path');
const AutoTask  = require('../src/auto-task').AutoTask;
const dirname   = __dirname + '/base/mod1';
let autoTask    = null;

describe("task :: do_clear()", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname);
        autoTask.do_clear();
    });
    it("파일 유무", () => {
        const fullPath = dirname + '/src/one.html';
        expect(fs.existsSync(fullPath)).toBeFalsy();
    });
});

describe("task :: do_publish()", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname);
        autoTask.do_publish();
    });
    it("파일 유무", () => {
        const fullPath = dirname + '/src/one.html';
        expect(fs.existsSync(fullPath)).toBeTruthy();
    });
    it("파일 비교", () => {
        const fullPath = dirname + '/src/one.html';
        const data = fs.readFileSync(fullPath,'utf-8');
        expect(fs.existsSync(fullPath)).toBeTruthy();
        expect(data).toMatchSnapshot();
    });
    it("속성", () => {
        const prop = autoTask.entry.src['one.html'].getObject();
        expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
    });
});

describe("task :: rename template.js", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname, 'newTemplate.js');
        autoTask.do_clear(1);   // 강제 초기화
        autoTask.do_publish();
    });
    it("파일 유무", () => {
        const fullPath = dirname + '/src/one.html';
        expect(fs.existsSync(fullPath)).toBeTruthy();
    });
    it("속성", () => {
        const isRename = autoTask.entry.isRename;
        expect(isRename).toBeTruthy();
    });
});
afterAll(() => {
    autoTask = null;
    console.log('auto = null');
    
});