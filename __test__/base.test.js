const { beforeEach } = require('@jest/globals');
const { throws } = require('assert');
const fs        = require('fs');
const path      = require('path');
const AutoTask  = require('../src/auto-task').AutoTask;
const dirname   = __dirname + '/base/mod1';
let autoTask    = null;

describe("task :: do_clear()", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_clear();
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
        autoTask.isLog = false;
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

/**
 * 수정 후 커버가 되는지
 * 상속 커버 시점에는 다르게 테스트 해야함
 *  - 상속커버의 원본은 별도로 관리됨
 * 출판
 *  - 출판 커버만 체크하면됨
 */
/**
 * >> do_clear(1) 강제 클리어
 * >> 파일 검사 (없는지)
 * >> do_publish() 
 * >> 파일 검사 (있는지)
 * >> 출판파일 수정 
 * >> do_clear() 클리어 
 * >> 파일 검사 (있는지)
 * >> do_clear(1) 강제 클래어 
 * >> 파일 없음 확인
 */

describe("task :: do_clear() change File", () => {
    beforeEach(() => {
        // 생성
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        // autoTask.entry.isLog = false;
        
    });
    describe('강제 클리어', () => {
        beforeEach(() => {
            // 강제 클리어
            autoTask.do_clear(1);
        });
        it('파일 검사 (없는지)', () => {
            const fullPath = dirname + '/src/one.html';
            expect(fs.existsSync(fullPath)).toBeFalsy();
        });
    });
    describe('출판 후 수정', () => {
        beforeEach(() => {
            // 출판 >> 수정 >> 초기화
            autoTask.do_publish();
            // 수정 : 없으면 오류
            const fullPath = dirname + '/src/one.html';
            const data = fs.readFileSync(fullPath,'utf-8');
            if(fs.existsSync(fullPath)) new Error('파일이 없습니다.');
            fs.writeFileSync(fullPath, data + ' [EDIT]', 'utf8');
            // 초기화 
            autoTask.do_clear();
        });
        it('수정 파일이 여부 확인', () => {
            const fullPath = dirname + '/src/one.html';
            const data = fs.readFileSync(fullPath,'utf-8');
            expect(fs.existsSync(fullPath)).toBeTruthy();
            expect(data).toMatch('[EDIT]');
        });
    });
    afterEach(() => {
        // 강제 클리어
    });
});

describe("task :: rename template.js", () => {
    beforeEach(() => {
        autoTask = AutoTask.create(dirname, 'newTemplate.js');
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 초기화 (별도이 스코프!!)
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
    // console.log('auto = null');
    
});