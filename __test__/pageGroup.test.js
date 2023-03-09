const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname   = __dirname + "/pageGroup/mod1";

describe("task :: clear", () => {
    it("[ 생성 및 do_clear(1) ]", () => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });

    it("- 파일 유무 : src/one.html (X)", () => {
        const fullPath = path.join(dirname, "src/one.html");
        expect(fs.existsSync(fullPath)).toBeFalsy();
    });

    describe("< hbs 내부에서 생성한 파일 >", ()=>{
        it("- 파일 유무 : src/inline/all/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p3_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p3_suf.html");
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
    
    describe("< ready() 에서 생성한 파일 >", ()=>{
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
        it("- 파일 유무 : src/ready/arg1/group_arg2/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/arg1/group_arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/arg1/group_arg2/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/arg1/pre_p2_suf/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/new_p3.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/new_p3.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/p3.html (X)", () => {
            const fullPath = path.join(dirname, "src/p3.html");
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
    
    describe("< *.hbs 검사 >", ()=>{
        it("- 파일 유무 : src/one.html", () => {
            const fullPath = path.join(dirname, "/src/one.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 비교 : src/one.html", () => {
            const fullPath = path.join(dirname, "/src/one.html");
            const data = fs.readFileSync(fullPath,"utf-8");
            expect(fs.existsSync(fullPath)).toBeTruthy();
            expect(data).toMatchSnapshot();
        });
    });
    
    describe("< *.hbs inline 생성파일 검사 >", ()=>{
        it("- 파일 유무 : src/inline/all/pre_p1_suf.html", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/all/pre_p2_suf.html", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/all/pre_p3_suf.html", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p3_suf.html");
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
    
    describe("< ready() 생성파일 검사 >", ()=>{
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
        it("- 파일 유무 : src/ready/arg1/group_arg2/pre_p1_suf.html", () => {
            const fullPath = path.join(dirname, "src/ready/arg1/group_arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/ready/arg1/group_arg2/pre_p2_suf.html", () => {
            const fullPath = path.join(dirname, "src/ready/arg1/group_arg2/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/p3.html", () => {
            const fullPath = path.join(dirname, "src/p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/ready/new_p3.html", () => {
            const fullPath = path.join(dirname, "src/ready/new_p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
    });

    describe("< 파일 비교 >", () => {
        it("- page : p1.html", () => {
            const fullPath1 = path.join(dirname, "src/ready/pre_p1_suf.html");
            const fullPath2 = path.join(dirname, "src/ready/arg1/group_arg2/pre_p1_suf.html");
            const fullPath3 = path.join(dirname, "src/inline/all/pre_p1_suf.html");
            const fullPath4 = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p1_suf.html");
            const fullPath5 = path.join(dirname, "src/inline/new_p1.html");
            const data1 = fs.readFileSync(fullPath1, "utf-8");
            const data2 = fs.readFileSync(fullPath2, "utf-8");
            const data3 = fs.readFileSync(fullPath3, "utf-8");
            const data4 = fs.readFileSync(fullPath4, "utf-8");
            const data5 = fs.readFileSync(fullPath5, "utf-8");
            expect(data1 === data2 && data3 === data4 && data1 === data5).toBeTruthy();
            expect(data1).toMatchSnapshot();
        });
        it("- page : p2.html", () => {
            const fullPath1 = path.join(dirname, "src/ready/pre_p2_suf.html");
            const fullPath2 = path.join(dirname, "src/ready/arg1/group_arg2/pre_p2_suf.html");
            const fullPath3 = path.join(dirname, "src/inline/all/pre_p2_suf.html");
            const fullPath4 = path.join(dirname, "src/inline/arg1_1/arg1_2/group_arg2/pre_p2_suf.html");
            const data1 = fs.readFileSync(fullPath1, "utf-8");
            const data2 = fs.readFileSync(fullPath2, "utf-8");
            const data3 = fs.readFileSync(fullPath3, "utf-8");
            const data4 = fs.readFileSync(fullPath4, "utf-8");
            expect(data1 === data2 && data3 === data4 && data1 === data3).toBeTruthy();
            expect(data1).toMatchSnapshot();
        });
        it("- page : p3.html", () => {
            const fullPath1 = path.join(dirname, "src/inline/all/pre_p3_suf.html");
            const fullPath2 = path.join(dirname, "src/ready/pre_p3_suf.html");
            const fullPath3 = path.join(dirname, "src/p3.html");
            const fullPath4 = path.join(dirname, "src/ready/new_p3.html");
            const data1 = fs.readFileSync(fullPath1, "utf-8");
            const data2 = fs.readFileSync(fullPath2, "utf-8");
            const data3 = fs.readFileSync(fullPath3, "utf-8");
            const data4 = fs.readFileSync(fullPath4, "utf-8");
            expect(data1 === data2 && data3 === data4 && data1 === data3).toBeTruthy();
            expect(data1).toMatchSnapshot();
        });
    });
});

describe("수정 후 초기화", () => {
    it("[ 수정 >> do_clear() ]", () => {
        const fullPath1 = path.join(dirname, "src/one.html");
        const fullPath2 = path.join(dirname, "src/inline/new_p1.html");
        const fullPath3 = path.join(dirname, "src/p3.html");
        const data1 = fs.readFileSync(fullPath1, "utf-8");
        const data2= fs.readFileSync(fullPath2, "utf-8");
        const data3= fs.readFileSync(fullPath3, "utf-8");

        if(fs.existsSync(fullPath1)) new Error(fullPath1 +" 파일이 없습니다.");
        if(fs.existsSync(fullPath2)) new Error(fullPath2 +" 파일이 없습니다.");
        if(fs.existsSync(fullPath3)) new Error(fullPath3 +" 파일이 없습니다.");
        // 1.수정
        fs.writeFileSync(fullPath1, data1 + " [EDIT]", "utf8");
        fs.writeFileSync(fullPath2, data2 + " [EDIT]", "utf8");
        fs.writeFileSync(fullPath3, data3 + " [EDIT]", "utf8");
        // 2.초기화 
        autoTask.do_clear();
    });
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
    it("- 수정 파일 여부 : src/p3.html ", () => {
        const fullPath = path.join(dirname, "src/p3.html");
        const data = fs.readFileSync(fullPath,"utf-8");
        expect(fs.existsSync(fullPath)).toBeTruthy();
        expect(data).toMatch("[EDIT]");
    });

    describe("< 초기화 파일 >", ()=>{
        it("- 파일 유무 : src/inline/all/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p3_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p3_suf.html");
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
        it("- 파일 유무 : src/ready/arg1/group_arg2/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/arg1/group_arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/arg1/group_arg2/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/arg1/pre_p2_suf/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/new_p3.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/new_p3.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
    });
});