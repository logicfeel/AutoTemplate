
// import {describe, expect, test} from '@jest/globals';
// import fs from "fs";
// import path from "path";
// import {AutoTask} from "../src/auto-task";

const fs        = require('fs');
const path      = require('path');
const AutoTask  = require('../src/auto-task').AutoTask;
// const {describe, expect, test} = require('@jest/globals');

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
        const prop1 = autoTask.entry.data['entity'].getObject();
        const prop2 = autoTask.entry.helper['bold'].getObject();
        const prop3 = autoTask.entry.part['inc/content'].getObject();
        const prop4 = autoTask.entry.part['inc/footer'].getObject();
        const prop5 = autoTask.entry.part['inc/header'].getObject();
        const prop6 = autoTask.entry.src['one.html'].getObject();
        expect(JSON.stringify(prop1, null, '\t')).toMatchSnapshot();
        expect(JSON.stringify(prop2, null, '\t')).toMatchSnapshot();
        expect(JSON.stringify(prop3, null, '\t')).toMatchSnapshot();
        expect(JSON.stringify(prop4, null, '\t')).toMatchSnapshot();
        expect(JSON.stringify(prop5, null, '\t')).toMatchSnapshot();
        expect(JSON.stringify(prop6, null, '\t')).toMatchSnapshot();
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