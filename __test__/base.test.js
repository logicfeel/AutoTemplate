const fs        = require("fs");
const path      = require("path");
const AutoTask  = require("../src/auto-task").AutoTask;
const dirname   = path.join(__dirname, "/base/mod1");
let autoTask    = null;

/**
 * 가짜 경로로 변경
 * @param {*} obj 
 * @returns 
 */
function changeFakePath(obj) {
    const dir = obj.dir;
    const fake = "@@";

    if (obj.origin) {
        return {
            isPublic: obj.isPublic,
            content: obj.content,
            dir: obj.dir.replace(dir, fake),
            area: obj.area,
            fullPath: obj.fullPath.replace(dir, fake),
            areaDir: obj.areaDir,
            subDir: obj.subDir,
            subPath: obj.subPath,
            localDir: obj.localDir,
            localPath: obj.localPath,
            name: obj.name,
            fileName: obj.fileName,
            filePath: obj.filePath.replace(dir, fake),
            saveName: obj.saveName,
            saveDir: obj.saveDir.replace(dir, fake),
            savePath: obj.savePath.replace(dir, fake),
            origin: obj.origin,
        };
    } else {
        return {
            isPublic: obj.isPublic,
            content: obj.content,
            dir: obj.dir.replace(dir, fake),
            area: obj.area,
            fullPath: obj.fullPath.replace(dir, fake),
            areaDir: obj.areaDir,
            subDir: obj.subDir,
            subPath: obj.subPath,
            localDir: obj.localDir,
            localPath: obj.localPath,
            name: obj.name,
            fileName: obj.fileName,
            filePath: obj.filePath.replace(dir, fake),
        };
    }
}

describe("task :: clear", () => {
    it("[ new >> do_clear(1) ]", () => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
    });
    it("- 파일 유무 : src/one.html(X)", () => {
        const fullPath = dirname + "/src/one.html";
        expect(fs.existsSync(fullPath)).toBeFalsy();
        
    });
});

describe("task :: publish", () => {
    it("[ new >> do_publish() ]", () => {
        autoTask = AutoTask.create(dirname);
        autoTask.isLog = false;
        autoTask.do_publish();
    });
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
    describe("< 속성 검사 >", () => {
        it("- data : entity.json", () => {
            const prop = changeFakePath(autoTask.entry.data["entity"].getObject());
            expect(JSON.stringify(prop, null, "\t")).toMatchSnapshot();
        });
        it("- helper : bold.js", () => {
            const prop = changeFakePath(autoTask.entry.helper["bold"].getObject());
            expect(JSON.stringify(prop, null, "\t")).toMatchSnapshot();
        });
        it("- part : inc/content.hbs", () => {
            const prop = changeFakePath(autoTask.entry.part["inc/content"].getObject());
            expect(JSON.stringify(prop, null, "\t")).toMatchSnapshot();
        });
        it("- part : inc/foote.hbs", () => {
            const prop = changeFakePath(autoTask.entry.part["inc/footer"].getObject());
            expect(JSON.stringify(prop, null, "\t")).toMatchSnapshot();
        });
        it("- part : inc/header.hbs", () => {
            const prop = changeFakePath(autoTask.entry.part["inc/header"].getObject());
            expect(JSON.stringify(prop, null, "\t")).toMatchSnapshot();
        });
        it("- src : one.html.hbs", () => {
            const prop = changeFakePath(autoTask.entry.src["one.html"].getObject());
            expect(JSON.stringify(prop, null, "\t")).toMatchSnapshot();
        });
    });
});

describe("change File", () => {
    it("[ new >> do_clear(1) >> do_publish() >> 파일 수정 >> do_clear() ]", () => {
        autoTask = AutoTask.create(dirname);    // 생성
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 클리어
        autoTask.do_publish();
        const fullPath = path.join(dirname, "/src/one.html");
        const data = fs.readFileSync(fullPath,"utf-8");
        if(fs.existsSync(fullPath)) new Error("파일이 없습니다."); // 수정 : 없으면 오류
        // 2.수정
        fs.writeFileSync(fullPath, data + " [EDIT]", "utf8");
        // 3.초기화 
        autoTask.do_clear();
    });
    it("- 수정 파일 여부 : src/one.html ", () => {
        const fullPath = path.join(dirname, "/src/one.html");
        const data = fs.readFileSync(fullPath,"utf-8");
        expect(fs.existsSync(fullPath)).toBeTruthy();
        expect(data).toMatch("[EDIT]");
    });
});

describe("rename template.js", () => {
    it("[ 생성 >> do_clear(1) >> do_publish() ]", () => {
        autoTask = AutoTask.create(dirname, "newTemplate.js");
        autoTask.isLog = false;
        autoTask.do_clear(1);   // 강제 초기화 (별도이 스코프!!)
        autoTask.do_publish();
    });
    it("- 생성 여부 : src/one.html", () => {
        const fullPath = dirname + "/src/one.html";
        expect(fs.existsSync(fullPath)).toBeTruthy();
    });
    it("- isRename 속성 여부 : AutoTemplate.isRename = true", () => {
        const isRename = autoTask.entry.isRename;
        expect(isRename).toBeTruthy();
    });
});