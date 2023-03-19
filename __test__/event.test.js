const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname   = path.join(__dirname, "/event/mod1");
let autoTask    = null;


describe("< 이벤트 >", () => {
    beforeAll(() => {
        jest.resetModules();
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
    });
    // it("- autoTemplate.used = true, 1, 'str' : 예외", () => {
    //     const template = autoTask.entry;
    //     expect(() => template.used = true).toThrow(/타입만/);
    //     expect(() => template.used = 1).toThrow(/타입만/);
    //     expect(() => template.used = 'str').toThrow(/타입만/);
    // });

    it("- autoTemplate : onInit, onInited", () => {
        // const fullPath = path.join(dirname, "/template/page/p4.html");
        const template = autoTask.entry;
        let arrEvent = [];

        template.onInit = (temp, auto) => { arrEvent.push('onInit') };
        template.onInited = (temp, auto) => { arrEvent.push('onInited') };
        template.onBuild = (temp, auto) => { arrEvent.push('onBuild') };
        template.onBuilded = (temp, auto) => { arrEvent.push('onBuilded') };
        template.init();
        
        expect(arrEvent).toEqual(['onInit', 'onInited']);
    });

    it("- AutoTemplate : onBuild, onBuilded", () => {
        const fullPath = path.join(dirname, "/template/page/p4.html");
        const template = autoTask.entry;
        let arrEvent = [];

        template.onInit = (temp, auto) => { arrEvent.push('onInit') };
        template.onInited = (temp, auto) => { arrEvent.push('onInited') };
        template.onBuild = (temp, auto) => { arrEvent.push('onBuild') };
        template.onBuilded = (temp, auto) => { arrEvent.push('onBuilded') };
        template.build();
        
        expect(arrEvent).toEqual(['onBuild', 'onBuilded']);
        expect(fs.existsSync(fullPath)).toBeTruthy();
    });

    it("- AutoTemplate.src : onCompile, onSave, onCompiled : SourceCompile", () => {
        const fullPath = path.join(dirname, "/src/single.html");
        const template = autoTask.entry;
        let arrEvent1 = [];
        let arrEvent2 = [];
        let arrEvent3 = [];

        template.src['single.html'].onCompile = (src) => { arrEvent1.push('onCompile') };
        template.src['single.html'].onSave = (src, sPath) => { arrEvent1.push('onSave') };
        template.src['single.html'].onCompiled = (src) => { arrEvent1.push('onCompiled') };
        template.part['title'].onCompile = (src) => { arrEvent2.push('onCompile') };
        template.part['title'].onSave = (src, sPath) => { arrEvent2.push('onSave') };
        template.part['title'].onCompiled = (src) => { arrEvent2.push('onCompiled') };
        template.page['p4.html'].onCompile = (src) => { arrEvent3.push('onCompile') };
        template.page['p4.html'].onSave = (src, sPath) => { arrEvent3.push('onSave') };
        template.page['p4.html'].onCompiled = (src) => { arrEvent3.push('onCompiled') };
        template.build();
        
        expect(arrEvent1).toEqual(['onCompile', 'onSave', 'onCompiled']);
        expect(arrEvent2).toEqual([]);
        expect(arrEvent3).toEqual(['onCompile', 'onCompiled']);
        expect(fs.existsSync(fullPath)).toBeTruthy();
    });

});

// test("fetch a user", (done) => {
//     fetchUser(2, (user) => {
//       expect(user).toEqual({
//         id: 1,
//         name: "User1",
//         email: "1@test.com",
//       });
//       done();
//     });
// });