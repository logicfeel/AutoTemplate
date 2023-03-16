const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname1   = path.join(__dirname, "/collection/mod1");
const dirname2   = path.join(__dirname, "/collection/mod2");
let autoTask1, autoTask2
// TODO: template 호이스팅
/**
 * 2개의 템플릿을 만들고 가져오기
 */
describe("main  ", () => {
    // 객체 생성에서 제어하기
    it("[ task로 설정 mod1, mod2 생성 ]", () => {
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
            expect(template1.group['all']._pages.length === 3).toBeDefined();
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

    });






    // it("- 파일 비교 : src/two.html", () => {
    //     const fullPath = path.join(dirname1, "/src/two.html");
    //     const data = fs.readFileSync(fullPath,"utf-8");
    //     expect(fs.existsSync(fullPath)).toBeTruthy();
    //     expect(data).toMatchSnapshot();
    // });

});

// 클래어 까지 테스트 한글이 잘써저야합니다. 무엇이 문제 인지는 확인해 보면 압니다.