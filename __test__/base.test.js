
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
        autoTask.do_clear(1);
    });
    it("파일 유무", () => {
        const fullPath = dirname + '/src/one.html';
        // 시점은 검토해야함
        // const publish = require(path.join(dirname, '__BuildFile.json'));
        expect(fs.existsSync(fullPath)).toBeFalsy();
        
    });
});

describe("task :: do_publish()", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname);
        autoTask.do_publish();
    });
    it("[파일 유무] : /src/one.html", () => {
        const fullPath = dirname + '/src/one.html';
        expect(fs.existsSync(fullPath)).toBeTruthy();
    });
    it("[파일 비교] : /src/one.html", () => {
        const fullPath = dirname + '/src/one.html';
        const data = fs.readFileSync(fullPath,'utf-8');
        expect(fs.existsSync(fullPath)).toBeTruthy();
        expect(data).toMatchSnapshot();
    });
    describe("[속성 비교]", () => {
        it("data : entity.json", () => {
            const prop = autoTask.entry.data['entity'].getObject();
            expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
        });
        it("helper : bold.js", () => {
            const prop = autoTask.entry.helper['bold'].getObject();
            expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
        });
        it("part : inc/content.hbs", () => {
            const prop = autoTask.entry.part['inc/content'].getObject();
            expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
        });
        it("part : inc/foote.hbs", () => {
            const prop = autoTask.entry.part['inc/footer'].getObject();
            expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
        });
        it("part : inc/header.hbs", () => {
            const prop = autoTask.entry.part['inc/header'].getObject();
            expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
        });
        it("src : one.html.hbs", () => {
            const prop = autoTask.entry.src['one.html'].getObject();
            expect(JSON.stringify(prop, null, '\t')).toMatchSnapshot();
        });
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