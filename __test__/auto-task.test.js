const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname   = path.join(__dirname, "/auto-task/mod1");
let autoTask    = null;

describe("create()", () => {
    it("- AutoTask.create(null) : 예외", () => {
        expect(() => autoTask = AutoTask.create(null)).toThrow();
    });
    it("- AutoTask.getInstance() ", () => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        const autoTask2 = AutoTask.getInstance();
        expect(autoTask === autoTask2).toBeTruthy();
    });

    // 임시로 주석 처리
    // it("- AutoTask.getInstance() : 예외 호출", () => {
    //     // autoTask = null;
    //     AutoTask._instance = null;
    //     expect(() => autoTask = AutoTask.getInstance()).toThrow();
    // });
});