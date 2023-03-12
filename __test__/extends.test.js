const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname   = path.join(__dirname, "extends/mod1");
let autoTask    = null;

/**
 * 강제 초기화
 * 출판
 *  파일 검사
 * 커버
 *  파일 검사
 * 수정 및 초기화
 *  파일 검사
 */

describe("task :: clear", () => {
    it("[ 생성 및 do_clear(1) ]", () => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
    describe("< 출판 파일 검사 >", ()=>{
        it("- 파일 유무 : src/one.html (X)", () => {
            const fullPath = path.join(dirname, "src/one.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/pre_p3_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/pre_p3_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/arg1_1/arg1_2/group_arg2/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/arg1_1/arg1_2/group_arg2/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/new_p1.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/new_p1.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
    });
    describe("< 커버 파일 검사 >", ()=>{
        it("- 파일 유무 : template/page/p1.html.hbs (X)", () => {
            const fullPath = path.join(dirname, "template/page/p1.html.hbs");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : template/page/p2.html.hbs (X)", () => {
            const fullPath = path.join(dirname, "template/page/p1.html.hbs");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : template/part/content.hbs (X)", () => {
            const fullPath = path.join(dirname, "template/part/content.hbs");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : template/part/title.hbs (X)", () => {
            const fullPath = path.join(dirname, "template/part/title.hbs");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : template/part/inc/header.hbs (X)", () => {
            const fullPath = path.join(dirname, "template/part/inc/header.hbs");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : template/helper/bold.js (X)", () => {
            const fullPath = path.join(dirname, "template/helper/bold.js");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
    });
});

describe("task :: publish", () => {
    it("[ 생성 및 do_publish() ]", () => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_publish();
    });
    
    describe("< 출판 파일 검사 >", ()=>{
        it("- 파일 유무 : src/one.html", () => {
            const fullPath = path.join(dirname, "/src/one.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/ready/pre_p1_suf.html", () => {
            const fullPath = path.join(dirname, "src/ready/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/ready/pre_p2_suf.html", () => {
            const fullPath = path.join(dirname, "src/ready/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/ready/pre_p3_suf.html", () => {
            const fullPath = path.join(dirname, "src/ready/pre_p3_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/arg1_1/arg1_2/group_arg2/pre_p1_suf.html", () => {
            const fullPath = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/arg1_1/arg1_2/group_arg2/pre_p2_suf.html", () => {
            const fullPath = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/new_p1.html", () => {
            const fullPath = path.join(dirname, "src/inline/new_p1.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
    });
    
    

    describe("수정 후 초기화", () => {
        it("[ 수정 >> do_clear() ]", () => {
            const fullPath1 = path.join(dirname, "src/one.html");
            const fullPath2 = path.join(dirname, "src/inline/new_p1.html");
            const data1 = fs.readFileSync(fullPath1, "utf-8");
            const data2 = fs.readFileSync(fullPath2, "utf-8");

            // 1.수정
            fs.writeFileSync(fullPath1, data1 + " [EDIT]", "utf8");
            fs.writeFileSync(fullPath2, data2 + " [EDIT]", "utf8");

            // 2.초기화 
            autoTask.do_clear();
        });

        describe("< src 파일 >", ()=>{
            it("- 수정 파일 여부 : src/one.html ", () => {
                const fullPath = path.join(dirname, "src/one.html");
                const data = fs.readFileSync(fullPath,"utf-8");
                expect(fs.existsSync(fullPath)).toBeTruthy();
                expect(data).toMatch("[EDIT]");
            });
            it("- 수정 파일 여부 : src/inline/new_p1.html ", () => {
                const fullPath = path.join(dirname, "src/inline/new_p1.html");
                const data = fs.readFileSync(fullPath,"utf-8");
                expect(fs.existsSync(fullPath)).toBeTruthy();
                expect(data).toMatch("[EDIT]");
            });
        });
        describe("< src 파일 >", ()=>{
            it("- 파일 유무 : src/ready/pre_p1_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/ready/pre_p1_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/ready/pre_p2_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/ready/pre_p2_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/ready/pre_p3_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/ready/pre_p3_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/inline/arg1_1/arg1_2/group_arg2/pre_p1_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p1_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/inline/arg1_1/arg1_2/group_arg2/pre_p2_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p2_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
        });

    });
    
});


describe("task :: cover", () => {
    it("[ 생성 및 do_cover() ]", () => {
        // AutoTask.destructor();
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_cover();
    });

    describe("< 커버 파일 검사 >", ()=>{
        it("- 파일 유무 : template/page/p1.html.hbs", () => {
            const fullPath = path.join(dirname, "template/page/p1.html.hbs");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : template/page/p2.html.hbs", () => {
            const fullPath = path.join(dirname, "template/page/p2.html.hbs");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : template/part/content.hbs", () => {
            const fullPath = path.join(dirname, "template/part/content.hbs");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : template/part/title.hbs", () => {
            const fullPath = path.join(dirname, "template/part/title.hbs");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : template/part/inc/header.hbs", () => {
            const fullPath = path.join(dirname, "template/part/inc/header.hbs");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : template/helper/bold.js", () => {
            const fullPath = path.join(dirname, "template/helper/bold.js");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        describe("< 오버라이딩 검사 >", ()=>{
            it("- 파일 : template/page/p1.html.hbs", () => {
                const fullPath1 = path.join(dirname, "template/page/p1.html.hbs");
                const data1 = fs.readFileSync(fullPath1, "utf-8");
                expect(data1).toMatch("page/p1.html(OVER)");
            });
            it("- 파일 : template/part/content.hbs", () => {
                const fullPath2 = path.join(dirname, "template/part/content.hbs");
                const data2 = fs.readFileSync(fullPath2, "utf-8");
                expect(data2).toMatch("part/content(OVER)");
            });
            it("- 파일 : template/page/p1.html.hbs", () => {
                const fullPath3 = path.join(dirname, "template/helper/bold.js");
                const data3 = fs.readFileSync(fullPath3, "utf-8");
                expect(data3).toMatch("mybold-OVER");
            });
        });
    });

    describe("수정 후 초기화", () => {
        it("[ 수정 >> do_clear() ]", () => {

            const fullPath3 = path.join(dirname, "template/page/p1.html.hbs");
            const fullPath4 = path.join(dirname, "template/part/title.hbs");
            const fullPath5 = path.join(dirname, "template/part/inc/footer.hbs");
            const fullPath6 = path.join(dirname, "template/helper/bold.js");

            const data3 = fs.readFileSync(fullPath3, "utf-8");
            const data4 = fs.readFileSync(fullPath4, "utf-8");
            const data5 = fs.readFileSync(fullPath5, "utf-8");
            const data6 = fs.readFileSync(fullPath6, "utf-8");
            // 1.수정
            fs.writeFileSync(fullPath3, data3 + " [EDIT]", "utf8");
            fs.writeFileSync(fullPath4, data4 + " [EDIT]", "utf8");
            if (data5.indexOf("[EDIT]") < 0) {
                fs.writeFileSync(fullPath5, data5 + " [EDIT]", "utf8"); // 재귀 수정파일 우회
            }
            fs.writeFileSync(fullPath6, data6 + " //[EDIT]", "utf8");
            // 2.초기화 
            autoTask.do_clear();
        });
            
        describe("< template 파일 >", ()=>{
            it("- 수정 파일 여부 : template/page/p1.html.hbs ", () => {
                const fullPath = path.join(dirname, "template/page/p1.html.hbs");
                const data = fs.readFileSync(fullPath,"utf-8");
                expect(fs.existsSync(fullPath)).toBeTruthy();
                expect(data).toMatch("[EDIT]");
            });
            it("- 수정 파일 여부 : template/part/title.hbs ", () => {
                const fullPath = path.join(dirname, "template/part/title.hbs");
                const data = fs.readFileSync(fullPath,"utf-8");
                expect(fs.existsSync(fullPath)).toBeTruthy();
                expect(data).toMatch("[EDIT]");
            });
            it("- 수정 파일 여부 : template/part/inc/footer.hbs ", () => {
                const fullPath = path.join(dirname, "template/part/inc/footer.hbs");
                const data = fs.readFileSync(fullPath,"utf-8");
                expect(fs.existsSync(fullPath)).toBeTruthy();
                expect(data).toMatch("[EDIT]");
            });
            it("- 수정 파일 여부 : template/helper/bold.js ", () => {
                const fullPath = path.join(dirname, "template/helper/bold.js");
                const data = fs.readFileSync(fullPath,"utf-8");
                expect(fs.existsSync(fullPath)).toBeTruthy();
                expect(data).toMatch("[EDIT]");
            });
        });

        describe("< template 파일 >", ()=>{
            it("- 파일 유무 : template/page/p2.html.hbs (X)", () => {
                const fullPath = path.join(dirname, "template/page/p2.html.hbs");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : template/part/content.hbs (X)", () => {
                const fullPath = path.join(dirname, "template/part/content.hbs");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : template/part/inc/header.hbs (X)", () => {
                const fullPath = path.join(dirname, "template/part/inc/header.hbs");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
        });
    });
});