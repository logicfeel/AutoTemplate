const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname   = path.join(__dirname, "/pageGroup/mod1");

describe("task :: clear", () => {
    it("[ 생성 및 do_clear(1) ]", () => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });

    it("- 파일 유무 : src/one.html (X)", () => {
        const fullPath = path.join(dirname, "src/one.html");
        expect(fs.existsSync(fullPath)).toBeFalsy();
    });

    describe("< hbs 내부에서 생성한 파일 >", ()=>{
        it("- 파일 유무 : src/inline/all/pre_p1.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p1.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p2.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p2.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p3.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p3.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/group_arg1/arg2/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/group_arg1/arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/group_arg1/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/inline/group_arg1/pre_p2_suf.html");
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
        it("- 파일 유무 : src/ready/group_arg1/arg2/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/group_arg1/arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/group_arg1/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname, "src/ready/group_arg1/pre_p2_suf.html");
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
        jest.resetModules();
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
        it("- 파일 유무 : src/inline/all/pre_p1.html", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p1.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/all/pre_p2.html", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p2.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/all/pre_p3.html", () => {
            const fullPath = path.join(dirname, "src/inline/all/pre_p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/group_arg1/arg2/pre_p1_suf.html", () => {
            const fullPath = path.join(dirname, "src/inline/group_arg1/arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/inline/group_arg1/pre_p2_suf.html", () => {
            const fullPath = path.join(dirname, "src/inline/group_arg1/pre_p2_suf.html");
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
        it("- 파일 유무 : src/ready/group_arg1/arg2/pre_p1_suf.html", () => {
            const fullPath = path.join(dirname, "src/ready/group_arg1/arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/ready/group_arg1/pre_p2_suf.html", () => {
            const fullPath = path.join(dirname, "src/ready/group_arg1/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/ready/new_p3.html", () => {
            const fullPath = path.join(dirname, "src/ready/new_p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/p3.html", () => {
            const fullPath = path.join(dirname, "src/p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
    });

    describe("< 파일 비교 >", () => {
        it("- page : p1.html", () => {
            const fullPath1 = path.join(dirname, "src/ready/pre_p1_suf.html");
            const fullPath2 = path.join(dirname, "src/ready/group_arg1/arg2/pre_p1_suf.html");
            const fullPath3 = path.join(dirname, "src/inline/all/pre_p1.html");
            const fullPath4 = path.join(dirname, "src/inline/group_arg1/arg2/pre_p1_suf.html");
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
            const fullPath2 = path.join(dirname, "src/ready/group_arg1/pre_p2_suf.html");
            const fullPath3 = path.join(dirname, "src/inline/all/pre_p2.html");
            const fullPath4 = path.join(dirname, "src/inline/group_arg1/pre_p2_suf.html");
            const data1 = fs.readFileSync(fullPath1, "utf-8");
            const data2 = fs.readFileSync(fullPath2, "utf-8");
            const data3 = fs.readFileSync(fullPath3, "utf-8");
            const data4 = fs.readFileSync(fullPath4, "utf-8");
            expect(data1 === data2 && data3 === data4 && data1 === data3).toBeTruthy();
            expect(data1).toMatchSnapshot();
        });
        it("- page : p3.html", () => {
            const fullPath1 = path.join(dirname, "src/inline/all/pre_p3.html");
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
            it("- 파일 유무 : src/inline/all/pre_p1.html (X)", () => {
                const fullPath = path.join(dirname, "src/inline/all/pre_p1.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/inline/all/pre_p2.html (X)", () => {
                const fullPath = path.join(dirname, "src/inline/all/pre_p2.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/inline/all/pre_p3.html (X)", () => {
                const fullPath = path.join(dirname, "src/inline/all/pre_p3.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/inline/group_arg1/arg2/pre_p1_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/inline/group_arg1/arg2/pre_p1_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/inline/group_arg1/pre_p2_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/inline/group_arg1/pre_p2_suf.html");
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
            it("- 파일 유무 : src/ready/group_arg1/arg2/pre_p1_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/ready/group_arg1/arg2/pre_p1_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/ready/group_arg1/pre_p2_suf.html (X)", () => {
                const fullPath = path.join(dirname, "src/ready/group_arg1/pre_p2_suf.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/ready/new_p3.html (X)", () => {
                const fullPath = path.join(dirname, "src/ready/new_p3.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
        });
    });
});


/**
 * pageGroup 의 기본값의 설정
 * 대상만 빌드함
 */
describe("< PageGroup 기본값 변경 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname, "noneTemplate.js");
        autoTask.isLog = false;
        const template = autoTask.entry;
        template.group['all'].prefix = 'n_';
        template.group['all'].suffix = '_n';
        template.group['double'].prefix = 'nn_';
        template.group['double'].suffix = '_nn';
        template.group['double'].argfix = ['_NN', 'NN'];
        template.group['all'].build();
        template.group['double'].build();
        // autoTask.do_publish();
        template._saveBuildFile();
        // console.log('ee');
        
    });

    // REVIEW: pageGroup 으로 이동 검토
    it("- prfix, sufix, argfix : 예외 : 예외 ", () => {
        const template = autoTask.entry;
        expect(() => template.group['all'].argfix = 'a').toThrow(/타입 : array/);
        expect(() => template.group['all'].prefix = 1).toThrow(/타입 : string/);
        expect(() => template.group['all'].suffix = 1).toThrow(/타입 : string/);
    });

    describe("< prfix, sufix  => pg.build() >", () => {
        it("- 파일 유무 : src/n_p1_n.html", () => {
            const fullPath = path.join(dirname, "src/n_p1_n.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/n_p2_n.html", () => {
            const fullPath = path.join(dirname, "src/n_p2_n.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/n_p3_n.html", () => {
            const fullPath = path.join(dirname, "src/n_p3_n.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
    });
    describe("< prefix, suffix, argfix => pg.build() >", () => {
        it("- 파일 유무 : src/group_NN/NN/nn_p1_nn.html", () => {
            const fullPath = path.join(dirname, "src/group_NN/NN/nn_p1_nn.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/group_NN/nn_p2_nn.html", () => {
            const fullPath = path.join(dirname, "src/group_NN/nn_p2_nn.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });              
    });

    // 초기화
    describe("task :: clear", () => {
        it("[ 생성 및 do_clear(1) ]", () => {
            autoTask.do_clear(1);   // 강제 클리어
        });
        describe("< 생성 파일 지우기 >", ()=>{
            it("- 파일 유무 : src/n_p1_n.html (X)", () => {
                const fullPath = path.join(dirname, "src/n_p1_n.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/n_p2_n.html (X)", () => {
                const fullPath = path.join(dirname, "src/n_p2_n.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/n_p3_n.html (X)", () => {
                const fullPath = path.join(dirname, "src/n_p3_n.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/group_NN/NN/nn_p1_nn.html (X)", () => {
                const fullPath = path.join(dirname, "src/group_NN/NN/nn_p1_nn.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/group_NN/nn_p2_nn.html (X)", () => {
                const fullPath = path.join(dirname, "src/group_NN/nn_p2_nn.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
        });
    });
});

/**
 * 페이지 그룹을 수동으로 추가하고
 * double 는 재거 후 등록 하고
 * 빌드
 */
describe("< PageGroup page 교체 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname, "noneTemplate.js");
        autoTask.isLog = false;
        const template = autoTask.entry;
        template.group['double'].remove('p1.html');
        template.group['double'].add({ page: 'p3.html' });
        // template.group['all'].build();
        template.group['double'].build();
        // autoTask.do_publish();
        template._saveBuildFile();
    });
    
    describe("< p1.html >> p3.html 교체후 => pg.build() >", () => {
        it("- 파일 유무 : src/group/p2.html", () => {
            const fullPath = path.join(dirname, "src/group/p2.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/p3.html", () => {
            const fullPath = path.join(dirname, "src/p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });              
    });

    // 초기화
    describe("task :: clear", () => {
        it("[ 생성 및 do_clear(1) ]", () => {
            autoTask.do_clear(1);   // 강제 클리어
        });
        describe("< 생성 파일 지우기 >", ()=>{
            it("- 파일 유무 : src/group/p1.html (X)", () => {
                const fullPath = path.join(dirname, "src/group/p1.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/p2.html (X)", () => {
                const fullPath = path.join(dirname, "src/p2.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
        });
    });
});

describe("< PageGroup group 추가 및 제거 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname, "noneTemplate.js");
        autoTask.isLog = false;
        const template = autoTask.entry;

        template.group.add('three', [
            { page: 'p2.html' },
            { page: 'p3.html' },
        ]);

        template.group.remove('double');


        template.group['three'].build();
        // autoTask.do_publish();
        template._saveBuildFile();
    });
    
    it("- 그룹 유무 : all, three", () => {
        const template = autoTask.entry;
        expect(template.group['three']).toBeDefined();
        expect(template.group['all']).toBeDefined();   // 기존꺼 유지
        expect(template.group.count).toBe(2);
    });
    
    it("- autoTemplate.group.remove('all') 예약어 : 예외", () => {
        const template = autoTask.entry;
        expect(() => template.group.remove('all')).toThrow(/예약된/);
    });
    it("- autoTemplate.group.remove('noGroup') : 예외", () => {
        const template = autoTask.entry;
        expect(() => template.group.remove('noGroup')).toThrow(/존재하지/);
    });

    describe("< three 그룹 >", () => {
        it("- 파일 유무 : src/p2.html", () => {
            const fullPath = path.join(dirname, "src/p2.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/p3.html", () => {
            const fullPath = path.join(dirname, "src/p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });              
    });

    // 초기화
    describe("task :: clear", () => {
        it("[ 생성 및 do_clear(1) ]", () => {
            autoTask.do_clear(1);   // 강제 클리어
        });
        describe("< 생성 파일 지우기 >", ()=>{
            it("- 파일 유무 : src/p2.html (X)", () => {
                const fullPath = path.join(dirname, "src/p2.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/p3.html (X)", () => {
                const fullPath = path.join(dirname, "src/p3.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
        });
    });
});

/**
 * 예외처리
 */
describe("< PageGroup 예외 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname, "noneTemplate.js");
        autoTask.isLog = false;
        // const template = autoTask.entry;
        // template.group['double'].remove('p1.html');
        // template.group['double'].add({ page: 'p3.html' });
        // // template.group['all'].build();
        // template.group['double'].build();
        // // autoTask.do_publish();
        // template._saveBuildFile();
    });
    
    it("- autoTemplate.group['double'] = not_p3.html : 예외", () => {
        const template = autoTask.entry;
        expect(() => template.group['double'].add({ page: 'not_p3.html' })).toThrow(/존재하지 않습니다./);
    });
    it("- autoTemplate.group.add(0) : 예외", () => {
        const template = autoTask.entry;
        expect(() => template.group.add(0)).toThrow(/alias에 string/);
    });
    it("- autoTemplate.group.add('all') 예약어 : 예외", () => {
        const template = autoTask.entry;
        // template.group.add('all', [{page: 'p3.html'}])
        expect(() => template.group.add('all', [{page: 'p3.html'}])).toThrow(/예약어/);
    });
    it("- autoTemplate.group.add('three', {page: 'p3.html'} ) 배열아님 : 예외", () => {
        const template = autoTask.entry;
        expect(() => template.group.add('three', {page: 'p3.html'})).toThrow(/pages array<object> 만/);
    });
    it("- autoTemplate.group.add('three', [page: 'p3.html'], 'notArray' ) 배열아님 : 예외", () => {
        const template = autoTask.entry;
        expect(() => template.group.add('three', [{page: 'p3.html'}], 'notArray')).toThrow(/deffix 는 array<object>/);
    });
});
