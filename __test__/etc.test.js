const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname   = path.join(__dirname, "/etc/mod1");
let autoTask    = null;


describe("< 인스턴스 생성 >", () => {
    beforeAll(() => {
        jest.resetModules();
        // autoTask = AutoTask.create(autoTask);
        // autoTask.isLog = false;
        // const template2 = autoTask2.entry;
        // template2.group['double'].remove('p1.html');
        // template2.group['double'].add({ page: 'p3.html' });
        // // template2.group['all'].build();
        // template2.group['double'].build();
        // // autoTask2.do_publish();
        // template2._saveBuildFile();
    });
    
    it("- AutoTask.create() 설정전 getInstance() 사용 : 예외", () => {
        let task;

        // task = AutoTask.getInstance();
        // expect(() => task = AutoTask.getInstance()).toThrow();
        expect(() => task = AutoTask.getInstance()).toThrow(/생성되지/);
    });

    it("- AutoTask.create() === AutoTask.getInstance() ", () => {
        autoTask = AutoTask.create(dirname);
        const task = AutoTask.getInstance();
        // const fullPath = path.join(dirname2, "src/group/p2.html");
        expect(autoTask).toEqual(task);
    });

    it("- autoTask.isLog = 2 : 예외", () => {
        // let task;
        
        // task = AutoTask.getInstance();
        // expect(() => task = AutoTask.getInstance()).toThrow();
        expect(() => autoTask.isLog = 3).toThrow(/boolean/);
    });
});


describe("< 예외 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
    });
    it("- autoTemplate.used = true, 1, 'str' : 예외", () => {
        const template = autoTask.entry;
        expect(() => template.used = true).toThrow(/타입만/);
        expect(() => template.used = 1).toThrow(/타입만/);
        expect(() => template.used = 'str').toThrow(/타입만/);
    });
});