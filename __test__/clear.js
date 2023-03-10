

const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname1   = __dirname + "/base/mod1";
const dirname2   = __dirname + "/pageGroup/mod1";
const dirname3   = __dirname + "/import/mod1";
const dirname4   = __dirname + "/extends/mod1";

describe("task :: clear", () => {
    it("[ base 생성 및 do_clear(1) ]", () => {
        autoTask = AutoTask.create(dirname1);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
    it("[ pageGroup 생성 및 do_clear(1) ]", () => {
        autoTask = AutoTask.create(dirname2);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
    it("[ import 생성 및 do_clear(1) ]", () => {
        autoTask = AutoTask.create(dirname3);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
    it("[ import 생성 및 do_clear(1) ]", () => {
        autoTask = AutoTask.create(dirname4);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
});