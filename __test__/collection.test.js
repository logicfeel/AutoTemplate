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
    it("[ task로 설정 mod1, mod2 생성 ]", () => {
        jest.resetModules();
        autoTask1 = AutoTask.create(dirname1);
        autoTask1.isLog = false;
        autoTask2 = AutoTask.create(dirname2);
        autoTask2.isLog = false;
    });
    // 테스트를 통해서 제어하기
    describe("< 컬렉션 속성 설정 >", () => {
        
        describe("< helper >", () => {
            it("- autoTemplate.helper = helper : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.helper = template2.helper;
                expect(template1.helper['bold']).toBeDefined();
                expect(template1.helper.count === 1).toBeTruthy();
            });
            it("- autoTemplate.helper = data : 예외", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                expect(() => template1.helper = template2.data).toThrow();
            });
        });

        describe("< data >", () => {
            it("- autoTemplate.data = data : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.data = template2.data;
                expect(template1.data['entity']).toBeDefined();
                expect(template1.data.count === 1).toBeTruthy();
            });
            it("- autoTemplate.data = helper : 예외", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                expect(() => template1.data = template2.helper).toThrow();
            });
        });

        describe("< src >", () => {
            // it("- autoTemplate.src.addCollection(src) : 설정", () => {
            //     const template1 = autoTask1.entry;
            //     const template2 = autoTask2.entry;
            //     template1.src.addCollection(template2.src);
            //     expect(template1.src['one.html']).toBeDefined();
            //     expect(template1.src['two.html']).toBeDefined();
            //     expect(template1.src.count === 2).toBeTruthy();
            // });

            it("- autoTemplate.src = part : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.src = template2.part;
                expect(template1.src['inc/content']).toBeDefined();
                expect(template1.src['inc/footer']).toBeDefined();
                expect(template1.src['inc/header']).toBeDefined();
                expect(template1.src.count === 3).toBeTruthy();
            });
            it("- autoTemplate.src = page : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.src = template2.page;
                expect(template1.src['p1.html']).toBeDefined();
                expect(template1.src['p2.html']).toBeDefined();
                expect(template1.src['p3.html']).toBeDefined();
                expect(template1.src.count === 3).toBeTruthy();
            });
            it("- autoTemplate.src = src : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.src = template2.src;
                expect(template1.src['one.html']).toBeDefined();
                expect(template1.src.count === 1).toBeTruthy();
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
        });
        
        describe("< part >", () => {
            it("- autoTemplate.part = part : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.part = template2.part;
                expect(template1.part['inc/content']).toBeDefined();
                expect(template1.part['inc/footer']).toBeDefined();
                expect(template1.part['inc/header']).toBeDefined();
                expect(template1.part.count === 3).toBeTruthy();
            });
            it("- autoTemplate.part = src : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.part = template2.src;
                expect(template1.part['one.html']).toBeDefined();
                expect(template1.part.count === 1).toBeTruthy();
            });
            it("- autoTemplate.part = page : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.part = template2.page;
                expect(template1.part['p1.html']).toBeDefined();
                expect(template1.part['p2.html']).toBeDefined();
                expect(template1.part['p3.html']).toBeDefined();
                expect(template1.part.count === 3).toBeTruthy();
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
        });

        describe("< page >", () => {
            it("- autoTemplate.page = src : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.page = template2.src;
                expect(template1.page['one.html']).toBeDefined();
                expect(template1.page.count === 1).toBeTruthy();
                expect(template1.group['all']._pages.length === 1).toBeTruthy();
            });
            it("- autoTemplate.page = part : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.page = template2.part;
                expect(template1.page['inc/content']).toBeDefined();
                expect(template1.page['inc/footer']).toBeDefined();
                expect(template1.page['inc/header']).toBeDefined();
                expect(template1.page.count === 3).toBeTruthy();
                expect(template1.group['all']._pages.length === 3).toBeTruthy();
            });
            it("- autoTemplate.page = page : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.page = template2.page;
                expect(template1.page['p1.html']).toBeDefined();
                expect(template1.page['p2.html']).toBeDefined();
                expect(template1.page['p3.html']).toBeDefined();
                expect(template1.page.count === 3).toBeTruthy();
                expect(template1.page['p4.html']).toBeUndefined();
                expect(template1.group['all']._pages.length === 3).toBeTruthy();
            });
            it("- autoTemplate.page.remove('p1.html') : 삭제", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.page = template2.page;
                expect(template1.page['p1.html']).toBeDefined();
                expect(template1.group['all']._pages.length === 3).toBeTruthy();
                template1.page.remove('p1.html');
                expect(template1.page['p4.html']).toBeUndefined();
                expect(template1.group['all']._pages.length === 2).toBeTruthy();
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

        /**
         * all 그룹에 대한 해법? ==> 없어저야함, 전체 초기화
         * 전체 그룹에 재성정 한다는 기존 group 은 없어진다는 의미
         * group 은 이동이 되어야하고,
         *  - 단 참조만 설정한다?
         * page 단일 추가시 'all'에 추가 => test
         * page 전체 설정시 'all'에 재설정 => test
         * 
         * 이름 중복시?
         * 
         * 단일은 추가하고 
         */
        describe("< group >", () => {
            it("- autoTemplate.group = group : 설정", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                template1.group = template2.group;
                expect(template1.group['double']).toBeDefined();
                expect(template1.group['all']).toBeDefined();   // 기존꺼 유지
                expect(template1.group.count === 2).toBeTruthy();
            });
            it("- autoTemplate.group = helper : 예외", () => {
                const template1 = autoTask1.entry;
                const template2 = autoTask2.entry;
                expect(() => template1.group = template2.helper).toThrow();
            });


            // it("- autoTemplate.page = src : 설정", () => {
            //     const template1 = autoTask1.entry;
            //     const template2 = autoTask2.entry;
            //     template1.page = template2.src;
            //     expect(template1.page['one.html']).toBeDefined();
            // });
            // it("- autoTemplate.page = part : 설정", () => {
            //     const template1 = autoTask1.entry;
            //     const template2 = autoTask2.entry;
            //     template1.page = template2.part;
            //     expect(template1.page['inc/content']).toBeDefined();
            //     expect(template1.page['inc/footer']).toBeDefined();
            //     expect(template1.page['inc/header']).toBeDefined();
            // });
            // it("- autoTemplate.part = data : 예외", () => {
            //     const template1 = autoTask1.entry;
            //     const template2 = autoTask2.entry;
            //     expect(() => template1.page = template2.data).toThrow();
            // });
        });

    });
    
});
// 복제 검사
describe("< 복제 검사 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask2 = AutoTask.create(dirname2);
        autoTask2.isLog = false;
    });
    it("- src[0].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.src[0];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- part[0].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.part[0];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- part[1].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.part[1];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- part[2].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.part[2];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- data[0].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.data[0];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- helper[0].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.helper[0];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- page[0].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.page[0];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- page[1].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.page[1];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
    it("- page[2].clone().getObject() 비교", () => {
        const template2 = autoTask2.entry;
        const ori = template2.page[2];
        const tar = ori.clone();
        const obj1 = JSON.stringify(ori.getObject());
        const obj2 = JSON.stringify(tar.getObject());
        expect(obj1 === obj2).toBeTruthy();
    });
});

/**
 * TODO:  src 의 경우 복제시 메인 경로는 바뀌어야함
 * one, two 도 최신으로 갱신
 */
describe("< 컬렉션 전체 설정 후 publish >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask1 = AutoTask.create(dirname1);
        autoTask1.isLog = false;
        autoTask2 = AutoTask.create(dirname2);
        autoTask2.isLog = false;
        const template1 = autoTask1.entry;
        const template2 = autoTask2.entry;
        // template1.src = template2.src;
        template1.part = template2.part;
        template1.helper = template2.helper;
        template1.data = template2.data;
        template1.group = template2.group;  // group 교체되고 2개가 추가됨 : 참조로
        // template1.page = template2.page;    // page 3개가 추가됨
        
        
        // autoTask1.do_publish();

        // let c = template1.part[0].clone();
        // const clone = { ...c };
        // console.log('ww');
        
    });
    describe("< 켈렉션 설정 검사 >", () => {
        it("- autoTemplate.page : 그룹 소속 page ", () => {
            const template1 = autoTask1.entry;
            expect(template1.page['p1.html']).toBeDefined();
            expect(template1.page['p2.html']).toBeDefined();
            expect(template1.page['p4.html']).toBeDefined();
            expect(template1.page.count === 3).toBeTruthy();
        });
        it("- autoTemplate.group : 검사 ", () => {
            const template1 = autoTask1.entry;
            expect(template1.group['double']).toBeDefined();
            expect(template1.group['all']._pages.length).toBe(3);
        });
    });


    describe("< 출판 검사 >", () => {
        beforeAll(() => {
            autoTask1.do_publish();
        });
        it("- 파일 유무 : src/two.html", () => {
            const fullPath = path.join(dirname1, "/src/two.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        describe("< *.hbs 내부 >", () => {
            describe("< group/all dir='inline' prefix='pre_' >", () => {
                it("- 파일 유무 : src/inline/all/pre_p1.html", () => {
                    const fullPath = path.join(dirname1, "src/inline/all/pre_p1.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
                it("- 파일 유무 : src/inline/all/pre_p2.html", () => {
                    const fullPath = path.join(dirname1, "src/inline/all/pre_p2.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
                it("- 파일 유무 : src/inline/all/pre_p4.html", () => {
                    const fullPath = path.join(dirname1, "src/inline/all/pre_p4.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
            });
            describe("< group/double dir='inline' prefix='pre_' suffix='_suf' args='_arg1,arg2' >", () => {
                it("- 파일 유무 : src/inline/group_arg1/arg2/pre_p1_suf.html", () => {
                    const fullPath = path.join(dirname1, "src/inline/group_arg1/arg2/pre_p1_suf.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
                it("- 파일 유무 : src/inline/group_arg1/pre_p2_suf.html", () => {
                    const fullPath = path.join(dirname1, "src/inline/group_arg1/pre_p2_suf.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });                
            });
            describe("< page/p1.html path='inline/new_p1.html' >", () => {
                it("- 파일 유무 : src/inline/new_p1.html", () => {
                    const fullPath = path.join(dirname1, "src/inline/new_p1.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
            });
        });
        describe("< template.ready() >", () => {
            describe("< this.attachGroup(this.group['all'], 'pre_', '_suf', [], 'ready/all'); >", () => {
                it("- 파일 유무 : src/ready/all/pre_p1_suf.html", () => {
                    const fullPath = path.join(dirname1, "src/ready/all/pre_p1_suf.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
                it("- 파일 유무 : src/ready/all/pre_p2_suf.html", () => {
                    const fullPath = path.join(dirname1, "src/ready/all/pre_p2_suf.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
                it("- 파일 유무 : src/ready/all/pre_p4_suf.html", () => {
                    const fullPath = path.join(dirname1, "src/ready/all/pre_p4_suf.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
            });
            describe("< page/p1.html path='ready/new_p1.html' >", () => {
                it("- 파일 유무 : src/ready/new_p4.html", () => {
                    const fullPath = path.join(dirname1, "src/ready/new_p4.html");
                    expect(fs.existsSync(fullPath)).toBeTruthy();
                });
            });
        });
    });

});

// 초기화
describe("task :: clear", () => {
    it("[ 생성 및 do_clear(1) ]", () => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname1);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
    describe("< 출판 파일 검사 >", ()=>{
        it("- 파일 유무 : src/two.html (X)", () => {
            const fullPath = path.join(dirname1, "src/two.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p1.html (X)", () => {
            const fullPath = path.join(dirname1, "src/inline/all/pre_p1.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p2.html (X)", () => {
            const fullPath = path.join(dirname1, "src/inline/all/pre_p2.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/all/pre_p4.html (X)", () => {
            const fullPath = path.join(dirname1, "src/inline/all/pre_p4.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/group_arg1/arg2/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname1, "src/inline/group_arg1/arg2/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/group_arg1/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname1, "src/inline/group_arg1/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/inline/new_p1.html (X)", () => {
            const fullPath = path.join(dirname1, "src/inline/new_p1.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/all/pre_p1_suf.html (X)", () => {
            const fullPath = path.join(dirname1, "src/ready/all/pre_p1_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/all/pre_p2_suf.html (X)", () => {
            const fullPath = path.join(dirname1, "src/ready/all/pre_p2_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/all/pre_p4_suf.html (X)", () => {
            const fullPath = path.join(dirname1, "src/ready/all/pre_p4_suf.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/ready/new_p4.html (X)", () => {
            const fullPath = path.join(dirname1, "src/ready/new_p4.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
    });
});



describe("< 단독 빌드 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask2 = AutoTask.create(dirname2);
        autoTask2.isLog = false;
    });
    it("- page['p1.html'].build()", () => {
        const fullPath = path.join(dirname2, "/template/page/p1.html");
        const template = autoTask2.entry;
        template.page['p1.html'].build();
        expect(fs.existsSync(fullPath)).toBeTruthy();
    });
    it("- part['inc/header'].build()", () => {
        const fullPath = path.join(dirname2, "/template/part/inc/header");
        const template = autoTask2.entry;
        template.part['inc/header'].build();
        expect(fs.existsSync(fullPath)).toBeTruthy();

    });
    // 초기화
    describe("task :: clear", () => {
        it("[ 생성 및 do_clear(1) ]", () => {
            autoTask2.do_clear(1);   // 강제 클리어
        });
        describe("< 생성 파일 지우기 >", ()=>{
            it("- 파일 유무 : src/page/p1.html (X)", () => {
                const fullPath = path.join(dirname1, "src/page/p1.html");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
            it("- 파일 유무 : src/part/inc/header (X)", () => {
                const fullPath = path.join(dirname1, "src/part/inc/header");
                expect(fs.existsSync(fullPath)).toBeFalsy();
            });
        });
    });
});

/**
 * mod2 >> mod1 로 독립적으로 삽입 예외 처리 합니다.
 */
describe("< data | helper .add() 예외 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask1 = AutoTask.create(dirname1);
        autoTask1.isLog = false;
    });
    it("- autoTemplate.data.add(숫자) : 예외", () => {
        const template2 = autoTask2.entry;
        expect(() => template2.data.add(0)).toThrow(/alias에 string/);
    });
    it("- autoTemplate.data.add('test', 내용없음) : 예외", () => {
        const template2 = autoTask2.entry;
        expect(() => template2.data.add('test')).toThrow(/null 또는 undefined/);
        expect(() => template2.data.add('test', 'str')).toThrow(/타입 : object/);
        expect(() => template2.data.add('test', 1)).toThrow(/타입 : object/);
    });

    it("- autoTemplate.helper.add(숫자) : 예외", () => {
        const template2 = autoTask2.entry;
        expect(() => template2.helper.add(0)).toThrow(/alias에 string/);
    });
    it("- autoTemplate.helper.add('test', 내용없음) : 예외", () => {
        const template2 = autoTask2.entry;
        expect(() => template2.helper.add('test')).toThrow(/null 또는 undefined/);
        expect(() => template2.helper.add('test', 'str')).toThrow(/타입 : function/);
        expect(() => template2.helper.add('test', {})).toThrow(/타입 : function/);
    });
});

describe("< [part, page, src].add() 예외 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask1 = AutoTask.create(dirname1);
        autoTask1.isLog = false;
    });
    it("- autoTemplate.part.add(숫자) : 예외", () => {
        const template2 = autoTask2.entry;
        expect(() => template2.part.add(0)).toThrow(/alias에 string/);
    });
    it("- autoTemplate.part.add('test', 내용없음) : 예외", () => {
        const template2 = autoTask2.entry;
        expect(() => template2.part.add('test')).toThrow(/null 또는 undefined/);
        expect(() => template2.part.add('test', {})).toThrow(/타입 : string/);
        expect(() => template2.part.add('test', 1)).toThrow(/타입 : string/);
    });
    it("- autoTemplate.part.add('ns | page | group', 'text') 예약어 : 예외", () => {
        const template2 = autoTask2.entry;
        expect(() => template2.part.add('ns', 'text')).toThrow(/예약어를/);
        expect(() => template2.part.add('page', 'text')).toThrow(/예약어를/);
        expect(() => template2.part.add('group', 'text')).toThrow(/예약어를/);
    });
    
});

/**
 * 오버라이딩 : 컬렉션, 맞는 타입
 */
describe("< add() >> 속성 덮어쓰기 및 예외 처리 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask1 = AutoTask.create(dirname1);
        autoTask1.isLog = false;
        autoTask2 = AutoTask.create(dirname2);
        autoTask2.isLog = false;
    });
    it("- temp2.helper['bold'] = temp1.helper['sharp'] ", () => {
        const template1 = autoTask1.entry;
        const template2 = autoTask2.entry;
        template2.helper['bold'] = template1.helper['sharp'];
    });
    it("- temp2.helper['bold'] = 다른객체, 다른타입 : 예외 ", () => {
        const template1 = autoTask1.entry;
        const template2 = autoTask2.entry;
        expect(() => template2.helper['bold'] = {}).toThrow(/타입 : function/);
    });
    it("- temp2.data['entity'] = temp1.data['first'], {} ", () => {
        const template1 = autoTask1.entry;
        const template2 = autoTask2.entry;
        template2.data['entity'] = {};
        template2.data['entity'] = template1.data['first'];
    });
    it("- temp2.data['entity'] = 다른객체, 다른타입 : 예외 ", () => {
        const template1 = autoTask1.entry;
        const template2 = autoTask2.entry;
        expect(() => template2.data['entity'] = 'str').toThrow(/타입 : object/);
    });

    it("- temp2.part['inc/footer'] = temp1.part['title'] ", () => {
        const template1 = autoTask1.entry;
        const template2 = autoTask2.entry;
        template2.part['inc/footer'] = "inc/footer : overwrite";
        expect(template2.part['inc/footer'].content).toMatch(/overwrite/);
        template2.part['inc/footer'] = template1.part['title'];
    });
    it("- temp2.part['inc/footer'] = {} : 예외 ", () => {
        const template1 = autoTask1.entry;
        const template2 = autoTask2.entry;
        expect(() => template2.part['inc/footer'] = {}).toThrow(/타입 : string, function/);
    });
});

/**
 * p2를 복제해서 만들고 새로운 오버라이딩을 진행
 */
describe("< p2.html >> p2_clone.html 복제후 지역 설정 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask2 = AutoTask.create(dirname2);
        autoTask2.isLog = false;
        const template2 = autoTask2.entry;
    });
    it("- template2.page.count = 4 ", () => {
        const template2 = autoTask2.entry;
        template2.page.add('p2_clone.html', template2.page['p2.html']);
        expect(template2.page.count).toBe(4);
    });
    it("- 지역 partials 등록 ", () => {
        const template2 = autoTask2.entry;
        template2.page['p2_clone.html'].partials({
            'inc/footer': `<footer><!--part/inc/footer -->
            <p>clone footer. </p>
            $entity.Table={{ entity.Table }}$
            </footer>`
        });
        expect(template2.part['inc/footer'].content).not.toMatch(/clone/);
    });
    it("- 지역 helpers 등록 ", () => {
        const template2 = autoTask2.entry;
        template2.page['p2_clone.html'].helpers({
            'bold': function(options) {
                // return new Handlebars.SafeString('<div class="clone_bold">' + options.fn(this) + "</div>");
                return '<div class="clone_bold">' + options.fn(this) + "</div>";
            }
        });
    });
    it("- 지역 data 등록 ", () => {
        const template2 = autoTask2.entry;
        template2.page['p2_clone.html'].data({
            'entity': {
                "Table": "-1",
                "Tables": [-10, -20]
            }
        });
        expect(template2.data['entity'].content).not.toEqual({
            "Table": "-1",
            "Tables": [-10, -20]
        });
    });

    describe("< group[all] 출판 >", () => {
        beforeAll(() => {
            const template2 = autoTask2.entry;
            template2.group['all'].build();
        });
        it("- 파일 유무 : src/p1.html", () => {
            const fullPath = path.join(dirname2, "src/p1.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/p2.html", () => {
            const fullPath = path.join(dirname2, "src/p2.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/p3.html", () => {
            const fullPath = path.join(dirname2, "src/p3.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 유무 : src/p2_clone.html", () => {
            const fullPath = path.join(dirname2, "src/p2_clone.html");
            expect(fs.existsSync(fullPath)).toBeTruthy();
        });
        it("- 파일 검사 : src/p2.html", () => {
            const fullPath = path.join(dirname2, "src/p2.html");
            const data = fs.readFileSync(fullPath,"utf-8");
            expect(data).not.toMatch(/clone_bold/);
            expect(data).not.toMatch(/clone.footer/);
            expect(data).not.toMatch(/-10/);
            expect(data).toMatchSnapshot();

        });
        it("- 파일 검사 : src/p2_clone.html", () => {
            const fullPath = path.join(dirname2, "src/p2_clone.html");
            const data = fs.readFileSync(fullPath,"utf-8");
            expect(data).toMatch(/clone_bold/);
            expect(data).toMatch(/clone.footer/);
            expect(data).toMatch(/-1/);
            expect(data).toMatchSnapshot();
        });
    });

    // 초기화
    describe("task :: clear", () => {
        it("[ 생성 및 do_clear(1) ]", () => {
            autoTask2.do_clear(1);   // 강제 클리어
        });
        it("- 파일 유무 : src/p1.html (X)", () => {
            const fullPath = path.join(dirname2, "src/p1.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/p2.html (X)", () => {
            const fullPath = path.join(dirname2, "src/p2.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/p3.html (X)", () => {
            const fullPath = path.join(dirname2, "src/p3.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
        it("- 파일 유무 : src/p2_clone.html (X)", () => {
            const fullPath = path.join(dirname2, "src/p2_clone.html");
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
    });

});