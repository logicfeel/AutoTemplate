const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname1   = path.join(__dirname, "/collection/mod1");
const dirname2   = path.join(__dirname, "/collection/mod2");
let autoTask1, autoTask2
/**
 * 2개의 템플릿을 만들고 가져오기
 */
describe("main  ", () => {
    // 객체 생성에서 제어하기
    it("[ task로 설정 mod1, mod2 생성 및 do_clear(1) ]", () => {
        autoTask1 = AutoTask.create(dirname1);
        autoTask1.isLog = false;
        autoTask2 = AutoTask.create(dirname2);
        autoTask2.isLog = false;
    });
    // 테스트를 통해서 제어하기
    describe("< 컬렌션 복사 >", () => {
        it("- autoTemplate.helper = helper : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.helper = template2.helper;
            expect(template1.helper.count > 0).toBeTruthy();
        });
        it("- autoTemplate.helper = data : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.helper = template2.data).toThrow();
        });
        it("- autoTemplate.data = data : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.data = template2.data;
            expect(template1.data.count > 0).toBeTruthy();
        });
        it("- autoTemplate.data = helper : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.data = template2.helper).toThrow();
        });
        it("- autoTemplate.src = src : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.src = template2.src;
            expect(template1.src['one.html']).toBeDefined();
        });
        it("- autoTemplate.src = part : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.src = template2.part;
            expect(template1.src['inc/content']).toBeDefined();
            expect(template1.src['inc/footer']).toBeDefined();
            expect(template1.src['inc/header']).toBeDefined();
        });
        it("- autoTemplate.src = page : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.src = template2.page;
            expect(template1.src['p1.html']).toBeDefined();
            expect(template1.src['p2.html']).toBeDefined();
            expect(template1.src['p3.html']).toBeDefined();
        });
        it("- autoTemplate.src = helper : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.src = template2.helper).toThrow();
        });
        it("- autoTemplate.src = data : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.src = template2.data).toThrow();
        });
        it("- autoTemplate.part = part : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.part = template2.part;
            expect(template1.part['inc/content']).toBeDefined();
            expect(template1.part['inc/footer']).toBeDefined();
            expect(template1.part['inc/header']).toBeDefined();
        });
        it("- autoTemplate.part = src : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.part = template2.src;
            expect(template1.part['one.html']).toBeDefined();
        });
        it("- autoTemplate.part = page : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.part = template2.page;
            expect(template1.part['p1.html']).toBeDefined();
            expect(template1.part['p2.html']).toBeDefined();
            expect(template1.part['p3.html']).toBeDefined();
        });
        it("- autoTemplate.part = helper : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.part = template2.helper).toThrow();
        });
        it("- autoTemplate.part = data : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.part = template2.data).toThrow();
        });

        it("- autoTemplate.page = page : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.page = template2.page;
            expect(template1.page['p1.html']).toBeDefined();
            expect(template1.page['p2.html']).toBeDefined();
            expect(template1.page['p3.html']).toBeDefined();
        });
        it("- autoTemplate.page = src : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.page = template2.src;
            expect(template1.page['one.html']).toBeDefined();
        });
        it("- autoTemplate.page = part : 설정", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            template1.page = template2.part;
            expect(template1.page['inc/content']).toBeDefined();
            expect(template1.page['inc/footer']).toBeDefined();
            expect(template1.page['inc/header']).toBeDefined();
        });
        it("- autoTemplate.part = helper : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.page = template2.helper).toThrow();
        });
        it("- autoTemplate.part = data : 예외", () => {
            const template1 = autoTask1.entry;
            const template2 = autoTask2.entry;
            expect(() => template1.page = template2.data).toThrow();
        });

    });
});