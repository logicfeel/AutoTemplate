const fs                                    = require('fs');
const path                                  = require('path');
const glob                                  = require('glob');
const { PropertyCollection, Observer }      = require('entitybind');
const { TemplateCollection }                = require('./source-template');
const { CompileCollection }                 = require('./source-compile');
const { PageGroupCollection, PageGroup }    = require('./page-group');

/**
 * 오토템플릿 클래스
 */
class AutoTemplate {
    /*_______________________________________*/
    // public
    AREA = {
        HELPER: 'HELPER',
        DATA: 'DATA',
        PART: 'PART',
        SRC: 'SRC',
        PUB: 'PUB',
        PAGE: 'PAGE',
        GROUP: 'GROUP',
    };
    DIR = {
        HELPER: 'template/helper',  // TODO: path.sep 로 통일해야함
        DATA: 'template/data',
        PART: 'template/part',
        SRC: 'src',
        PUB: 'src',
        PAGE: 'template/page',
        ORIGIN: 'template/__cache',
    }
    DELIMITER = {
        HELPER: '-',
        DATA: '.',
        PART: path.sep,
        SRC: path.sep,
        PAGE: path.sep,
    };
    GLOB = {
        HELPER: 'template/helper/**/*.js',
        DATA: 'template/data/**/*.{js,json}',
        PART: 'template/part/**/*.{hbs,js}',
        SRC: 'src/**/*.hbs',
        PAGE: 'template/page/**/*.{hbs,js}',
    };
    FILE = {
        BUILD: '__BuildFile.json'
    };
    TEMP_EXT        = '.hbs';
    defaultPublic   = true;
    isFinal         = false;    // 상속 금지 설정
    isKeepEdit      = true;     // 수정 파일 유지
    
    /*_______________________________________*/
    // protected
    _auto = null;
    _buildFile = {
        cover: [],
        publish: [],
    };
    _groupInstance = [];
    
    /*_______________________________________*/
    // private
    #used               = null;
    #dir                = [];
    #event              = new Observer(this, this);
    #namespace          = null;
    #helper             = null;
    #data               = null;
    #part               = null;
    #src                = null;
    #page               = null;
    #group              = null;
    #localScope         = null;
    #outerScope         = null;
    
    /*_______________________________________*/        
    // property
    get used() { return this.#used === null ? this : this.#used; }
    set used(val) {
        if (val instanceof AutoTemplate) this.#used = val;
        else throw new Error('AutoTemplate 타입만 설정할 수 있습니다.');
    }
    get dir() {
        let size = this.#dir.length;
        if (size === 0) throw new Error(' start [dir] request fail...');
        return this.#dir[size - 1];
    }
    set dir(val) {
        if (this.isFinal === true && this.#dir.length > 0) {
            throw new Error('마지막 클래스(상속금지)는 dir 설정할 수 없습니다.');
        } else if (this.#dir.indexOf(val) < 0) this.#dir.push(val);
    }
    get dirs() { return this.#dir; }
    get namespace() { return this.#namespace }
    get ns() {return this.namespace }
    get helper() { return this.#helper }
    set helper(val) {
        if (val instanceof TemplateCollection && val.area === this.AREA.HELPER) {
            this.#helper.addCollectoin(val);
        } else {
            throw new Error('[helper] TemplateCollection 타입만 설정할 수 있습니다.');
        } 
    }
    get data() { return this.#data }
    set data(val) {
        if (val instanceof TemplateCollection && val.area === this.AREA.DATA) {
            this.#data.addCollectoin(val);
        } else {
            throw new Error('[data] TemplateCollection 타입만 설정할 수 있습니다.');
        } 
    }
    get part() { return this.#part }
    set part(val) {
        if (val instanceof CompileCollection) this.#part.addCollectoin(val);
        else throw new Error('CompileCollection 타입만 설정할 수 있습니다.');
    }
    get src() { return this.#src }
    set src(val) {  // REVIEW:
        if (val instanceof CompileCollection) this.#src.addCollectoin(val);
        else throw new Error('CompileCollection 타입만 설정할 수 있습니다.');
    }
    get page() { return this.#page }
    set page(val) { // REVIEW:
        if (val instanceof CompileCollection) this.#page.addCollectoin(val);
        else throw new Error('CompileCollection 타입만 설정할 수 있습니다.');
    }
    get group() { return this.#group }
    set group(val) {    // REVIEW:
        if (val instanceof PageGroupCollection) this.#group.addCollectoin(val);
        else throw new Error('CompileCollection 타입만 설정할 수 있습니다.');
    }
    get localScope() { 
        if (this.#localScope === null) this.#localScope = this._getLocalScope();
        return this.#localScope;
    }
    get outerScope() { 
        if (this.#outerScope === null) this.#outerScope = this._getOuterScope();
        return this.#outerScope;
    }

    /*_______________________________________*/        
    // event property
    set onInit(fn) { this.#event.subscribe(fn, 'init') }        // 초기화 전
    set onInited(fn) { this.#event.subscribe(fn, 'inited') }    // 초기화 전
    set onBuild(fn) { this.#event.subscribe(fn, 'build') }      // 빌드 전
    set onBuilded(fn) { this.#event.subscribe(fn, 'builded') }  // 빌드 전

    /**
     * 오토템플릿 생성자
     * @param {string} dir 시작경로
     * @param {Automation?} auto 소속된 오토메이션
     */
    constructor(dir, auto) {
        if (dir) this.dir = dir;      // Automation 설정시 사용
        if (auto) this._auto = auto;     // Automation 설정시 사용
        this.#namespace = new NamespaceCollection(this);
        this.#helper    = new TemplateCollection(this, this.AREA.HELPER);
        this.#data      = new TemplateCollection(this, this.AREA.DATA);
        this.#part      = new CompileCollection(this, this.AREA.PART);
        this.#src       = new CompileCollection(this, this.AREA.SRC);
        this.#page      = new CompileCollection(this, this.AREA.PAGE);
        this.#group     = new PageGroupCollection(this);
    }

    /*_______________________________________*/        
    // public method
    /**
     * 템플릿 파일을 불러오고 준비가 된 상태, overriding 으로 사용함
     * @virtual
     */
    ready() {/** 가상함수 */}

    /**
     * 초기화한다, 
     * 설정된 glob 정보로 파일을 컬렉션에 등록한다.
     */
    init() {
        
        let buildFile;
        
        // 이벤트 발생
        this._onInit(this, this._auto);

        // 네임스페이스 초기화 : AutoTemplate.init()
        for (let i = 0; i< this.namespace.count; i++) {
            this.namespace[i].init();
        }
        
        // 지역 초기화
        // this.helper.clear();
        // this.data.clear();
        // this.part.clear();
        // this.src.clear();
        // this.page.clear();
        // this.group.clear();
        // 적재
        this.helper.addGlob(this.GLOB.HELPER);
        this.data.addGlob(this.GLOB.DATA);
        this.part.addGlob(this.GLOB.PART);
        this.src.addGlob(this.GLOB.SRC);
        this.page.addGlob(this.GLOB.PAGE);
        this.group._setDefaultProp();   // group.all 컬렉션 추가

        // 이벤트 발생
        this._onInited(this, this._auto);

        // 사용처에서만 사용됨
        if (this === this.used) {
            if (fs.existsSync(this.dir + path.sep + this.FILE.BUILD)) {
                buildFile = require(this.dir + path.sep + this.FILE.BUILD);
                if (buildFile.cover) this._buildFile['cover'] = buildFile.cover;
                if (buildFile.publish) this._buildFile['publish'] = buildFile.publish;
            }
        }

        // 사옹자 정의 초기화 호출
        this.ready();
    }

    /**
     * 깨끗이 지운다. 생성파일을 삭제한다.
     * @param {number} opt = 1: 모두삭제, 2: 모두삭제(수정제외)
     */
    clear(opt = 2) {

        const buildFile = this.dir + path.sep + this.FILE.BUILD;
        const originDir = this.dir + path.sep + this.DIR['ORIGIN'];
        let filePath, oriPath, dir, dirs = [];
        let ignoreCover = [], ignorePub = [], areaDirs = [];
        // let source;

        function __checkChangeFile(tarPath, oriPath) {
            let oriData, tarData;
            // return true; 디버깅용
            // if (opt === 1) return true;
            if(fs.existsSync(tarPath)) tarData = fs.readFileSync(tarPath,'utf-8');
            else return false;  // 대상파일이 없으니 수정없음 처리
            
            if(fs.existsSync(oriPath)) oriData = fs.readFileSync(oriPath,'utf-8');
            else return false;   // 원본파일이 없는 경우 
            // 파일내용 비교
            // if (oriData.trim() === tarData.trim()) return true;
            if (oriData === tarData) return true;
            // console.log(1)
            return false;
        }

        // 파일 삭제
        for (let i = 0; i < this._buildFile['cover'].length; i++) {
            filePath = this._buildFile['cover'][i].tar;
            oriPath = this._buildFile['cover'][i].ori;

            if (opt === 1 && fs.existsSync(filePath)) {    // 강제 삭제
                fs.unlinkSync(filePath);
            } else if (__checkChangeFile(filePath, oriPath)) {
                fs.unlinkSync(filePath);
            } else {
                ignoreCover.push(this._buildFile['cover'][i]);
            }
            // 폴더 경로 저장
            dir = path.dirname(filePath);
            if (dirs.indexOf(dir) < 0) dirs.push(dir);
        }
        this._buildFile['cover'] = ignoreCover;


        for (let i = 0; i < this._buildFile['publish'].length; i++) {
            filePath = this._buildFile['publish'][i].tar;
            oriPath = this._buildFile['publish'][i].ori;

            if (opt === 1 && fs.existsSync(filePath)) {    // 강제 삭제
                fs.unlinkSync(filePath);
            } else if (__checkChangeFile(filePath, oriPath)) {
                fs.unlinkSync(filePath);
            } else {
                ignorePub.push(this._buildFile['publish'][i]);
            }
            // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            // 폴더 경로 저장
            dir = path.dirname(filePath);
            if (dirs.indexOf(dir) < 0) dirs.push(dir);
        }
        // this._buildFile['publish'] = [];
        this._buildFile['publish'] = ignorePub;

        // 남은 원본 확인후 삭제
        if (opt == 1) fs.rmSync(originDir, { recursive: true, force: true });



        if (this._buildFile['cover'].length === 0 &&  this._buildFile['publish'].length === 0 &&  
            fs.existsSync(buildFile)) fs.unlinkSync(buildFile);
        else this._saveBuildFile();

        // 빈폴더 제거
        // 조건 : 기본 디렉토리가 아니면서,
        // 함수로 재귀적으로 만들어야 할듯
        // 폴더삭제 함수 REVIEW: 공통함수로 추출
        function delEmptyDir(dir) {
            try {
                let paths, deepPath, file, isRecursive = false;
                
                if (!fs.existsSync(dir)) return; // 폴더가 없으면 리턴
                
                paths = fs.readdirSync(dir, { withFileTypes: true })
                if (paths.length === 0) {
                    // fs.unlinkSync(dir); // 빈폴더이면 삭제
                    fs.rmdirSync(dir);
                    console.log(`삭제폴더 :${dir}`);
                    return;
                }
                
                for (let i = 0; i < paths.length; i++) {
                    file = paths[i];
                    if (file.isDirectory()) {
                        delEmptyDir(dir + path.sep + file.name);
                        isRecursive = true;
                    }
                }
                // 재귀 호출후 재검사
                if (isRecursive) {
                    paths = fs.readdirSync(dir, { withFileTypes: true })
                    if (paths.length === 0) {
                        // fs.unlinkSync(dir); // 빈폴더이면 삭제
                        fs.rmdirSync(dir);
                    console.log(`삭제폴더 :${dir}`);
                        return;
                    }
                }

              } catch(e) {
                  return console.error('Delete Error', e);
              }
        }

        // REVIEW: 함수로 추출 검토
        // areaDirs.push(this.dir + path.sep + this.DIR['HELPER']);
        // areaDirs.push(this.dir + path.sep + this.DIR['DATA']);
        // areaDirs.push(this.dir + path.sep + this.DIR['PART']);
        // areaDirs.push(this.dir + path.sep + this.DIR['SRC']);
        // areaDirs.push(this.dir + path.sep + this.DIR['PUB']);
        // REVIEW: 코드 검토 필요
        for (const prop in this.DIR) {
            if (Object.hasOwnProperty.call(this.DIR, prop)) areaDirs.push(this.dir + path.sep + this.DIR[prop]);
        }  
        dirs.forEach(delDir => {
            let areaDir, subDir, arr;
            // 기본 areaDir 제외
            if (areaDirs.indexOf(delDir) < 0 && delDir.indexOf(this.dir) === 0) {
                areaDir = areaDirs.find(arrDir => delDir.indexOf(arrDir) > -1 );
                subDir = delDir.substring(areaDir.length + 1);
                arr = subDir.split(path.sep);
                delEmptyDir(areaDir + path.sep + arr[0]);
            }
        });

        this.helper.clear();
        this.data.clear();
        this.part.clear();
        this.src.clear();
        this.page.clear();
        this.group.clear();

    }

    /**
     * src 에 등록된 소스를 빌드한다.(템플릿을 컴파일한다.)
     */
    build(isKeep) {
        
        let instance = null;
        // let prefix, suffix, args;

        // 초기화
        // this.init();
        
        // 빌드 스코스 설정
        // this._localScope = this._getLocalScope();
        // this._outerScope = this._getOuterScope();

        // 이벤트 발생
        this._onBuild(this, this._auto);

        // 편집 유지 설정
        if (typeof isKeep === 'boolean') this.isKeepEdit;

        // 소스 컴파일
        for (let i = 0; i < this.src.count; i++) {
            this.src[i]._compile();
        }

        // 그룹 빌드 
        for (let i = 0; i < this._groupInstance.length; i++) {
            instance = this._groupInstance[i];
            // prefix = instance.prefix;
            // suffix = instance.suffix;
            // args = instance.args;
            // group.pageGroup.build(prefix, suffix, args);
            // instance.pageGroup.build({
            //     prefix: prefix,
            //     suffix: suffix,
            //     args: args
            // });
            instance.pageGroup.build(instance.data);
        }

        // for (let i = 0; i < this.src._group.length; i++) {
        //     this.src._group[i].pageGroup.build();
        // }

        // page 그룹 컴파일
        // for (let i = 0; i < this.src._group.length; i++) {
        //     group = this.src._group[i];
        //     for (let ii = 0; ii < group.length; ii++) {
        //         group[ii].pageGroup
        //     }
            
            
        //     this.src._group[i].compile();
        // }

        // 빌드 파일 저장
        this._saveBuildFile();
        
        // 이벤트 발생
        this._onBuilded(this, this._auto);
    }

    /**
     * 외부 AutoTemplate 의 part, helper, data 를 가져온다.
     * src는 제외
     * @param {string} alias 별칭
     * @param {AutoTemplate} template 
     */
    import(alias, template) {
        // // 템플릿 검사
        // if (!(template instanceof AutoTemplate)) new Error('AutoTemplate 타입만 설정할 수 있습니다.');
        // // 템플릿 사용위치 설정
        // template.used = this.used;
        // 외부 템플릿 등록
        this.namespace.add(alias, template);
    }

    /**
     * 빌드대상 소스에 page 구룹 추가
     * @param {PageGroup | string} obj 그룹명, 그룹객체
     * @param {*} prefix 
     * @param {*} suffix 
     * @param {*} agrs 
     */
    attachGroup(obj, prefix = '', suffix = '', args = []) {
        
        let group = null, alias;
        
        // HACK: 코드 보정해야함 명료하게 
        // 초기값
        if (typeof obj === 'string' && obj.length > 0) {
            alias = obj;
            group = this.group[alias] || null;
        } else if (obj instanceof PageGroup) {
            group = obj;
        }

        // if (typeof alias !== 'string' || alias.length === 0) {
        //     throw new Error('[필수] alias에 string 만 지정할 수 있습니다.');
        // }
        
        // group = this.group[alias] || null;

        if (!(group instanceof PageGroup)) {
            throw new Error('[필수] group 명이 존재하지 않습니다.');
        }

        this._groupInstance.push({
            pageGroup: group,
            data: {
                prefix: prefix,
                suffix: suffix,
                args: args
            }
        });
    }

    /*_______________________________________*/        
    // protected method
    /**
     * 테플릿의 지역범위의 객체를 리턴한다.
     * @returns {object} {part:{..}, helper: {..}, data: {..}}
     */
    _getLocalScope() {
        
        const _this = this;
        let obj = { part: {}, helper: {}, data: {} };
        let alias, delimiter, key;
        
        // part 로딩
        for (let i = 0; i < this.part.count; i++) {
            alias = this.part[i].alias;
            obj['part'][alias] =  this.part[i].content;
        }
        // page 로딩 (part)
        for (let i = 0; i < this.page.count; i++) {
            delimiter = this.DELIMITER.PART;
            alias = this.page[i].alias;
            key = this.AREA.PAGE.toLowerCase() + delimiter + alias;
            
            obj['part'][key] = function(data, hb) {
                
                let localData = {};
                let compileSrc = _this.page[i];
                let content, subPath;
                let isSave = false;
                
                for (let prop in data) {
                    if (!data._parent[prop]) localData[prop] = data[prop];
                }
                // savePath 경로르 변경 : dir 지정 시 파일별도생성
                // if (typeof localData['dir'] === 'string' || typeof localData['path'] === 'string') isSave = true;
                // subPath = localData['path'] || compileSrc.subPath.replace('.hbs','');
                // subPath = localData['dir'] ? localData['dir'] + path.sep + subPath : subPath;
                // POINT:
                if (typeof localData['path'] === 'string' && localData['path'].length > 0 ){
                    isSave = true;
                    subPath = localData['path'];
                    subPath = subPath.replaceAll('/', path.sep);
                    subPath = subPath.replaceAll('\\', path.sep);
                    compileSrc.savePath = _this.used.dir + path.sep + _this.DIR.PUB + path.sep + subPath;
                }
                
                // 단독저장의 경우 파일경로를 수정함
                // if (isSave) {
                //     // subPath = typeof localData['path'] === 'undefined' ? : localData['path'];
                //     compileSrc.savePath = _this.used.dir + path.sep + _this.DIR.PUB + path.sep + subPath;
                // }

                content = compileSrc._compile(localData, isSave);
                return isSave === true ? '' : content + '\n';
            }
        }
        // group 로딩 (part)
        for (let i = 0; i < this.group.count; i++) {
            delimiter = this.DELIMITER.PART;
            alias = this.group[i].alias;
            key = this.AREA.GROUP.toLowerCase() + delimiter + alias;
            
            obj['part'][key] = function(data, hb) {
                
                let localData = {};
                let pageSrc = _this.group[i];
                let args;
                
                for (let prop in data) {
                    if (!data._parent[prop]) localData[prop] = data[prop];
                }
                // savePath 경로르 변경 : dir 지정 시 파일별도생성
                // isSave = typeof localData.dir === 'undefined' ? false : true;
                // 단독저장의 경우 파일경로를 수정함
                // if (isSave) {
                //     compileSrc.savePath = _this.dir + path.sep + _this.PATH.SRC + path.sep + compileSrc.subPath.replace('.hbs','');
                // }
                
                // TODO: dir, path 받아서 적용해야함
                // prefix = localData.prefix;
                // suffix = localData.suffix;
                // TODO: 'a,b,c' 이런형식으로 전달 'a b c'
                // args = localData.args ? JSON.parse(localData.args) : [];

                if (typeof localData['args'] === 'string') {
                    // args = 
                    args = localData['args'].split(',');
                    args = args.map(val => val.trim()); // 문자열 공백 제거
                    localData['args'] = args;
                }
                // pageSrc.build(prefix, suffix, args);
                pageSrc.build(localData);
                return '';
            }
        }
        
        // heler 로딩
        for (let i = 0; i < this.helper.count; i++) {
            alias = this.helper[i].alias;
            obj['helper'][alias] =  this.helper[i].content;
        }
        // data 로딩
        for (let i = 0; i < this.data.count; i++) {
            alias = this.data[i].alias;
            obj['data'][alias] =  this.data[i].content;
        }
        return obj;
    }

    /**
     * 테플릿의 외부범위(import)의 객체를 리턴한다.
     * @returns {object} {part:{..}, helper: {..}, data: {..}}
     */
    _getOuterScope() {

        const _this = this;
        let obj = { part: {}, helper: {}, data: {} };
        let key, delimiter, outTemplate, alias, outAlias;

        for(let i = 0; i < this.namespace.count; i++) {
            outTemplate = this.namespace[i];
            alias = this.namespace.propertyOf(i);
            // ns.part
            for (let ii = 0; ii < outTemplate.part.count; ii++) {
                if (outTemplate.part[ii].isPublic == true) {
                    delimiter = outTemplate.DELIMITER.PART;
                    key = 'ns' + delimiter + alias + delimiter + outTemplate.part[ii].alias;
                    obj['part'][key] = function(data, hb) {
                        let localData = {};
                        let compileSrc = outTemplate.part[ii];
                        let content;
                        for (let prop in data) {
                            if (!data._parent[prop]) localData[prop] = data[prop];
                        }
                        content = compileSrc._compile(localData, false);
                        return content + '\n';
                    }
                }
            }
            // ns.page
            for (let ii = 0; ii < outTemplate.page.count; ii++) {
                if (outTemplate.page[ii].isPublic == true) {
                    delimiter = outTemplate.DELIMITER.PART;
                    key = 'ns' + delimiter + alias + delimiter + this.AREA.PAGE.toLowerCase() + delimiter + outTemplate.page[ii].alias;
                    obj['part'][key] = function(data, hb) {
                        
                        let localData = {};
                        let compileSrc = outTemplate.page[ii];
                        let content, subPath;
                        let isSave = false;

                        for (let prop in data) {
                            if (!data._parent[prop]) localData[prop] = data[prop];
                        }
                        // isSave = typeof localData.dir === 'undefined' ? false : true;
                        // if (typeof localData['dir'] === 'string' || typeof localData['path'] === 'string') isSave = true;
                        // subPath = localData['path'] || compileSrc.subPath.replace('.hbs','');
                        // subPath = localData['dir'] ? localData['dir'] + path.sep + subPath : subPath;
                        // POINT:
                        if (typeof localData['path'] === 'string' && localData['path'].length > 0 ){
                            isSave = true;
                            subPath = localData['path'];
                            subPath = subPath.replaceAll('/', path.sep);
                            subPath = subPath.replaceAll('\\', path.sep);
                            compileSrc.savePath = _this.used.dir + path.sep + _this.DIR.PUB + path.sep + subPath;
                        }

                        // if (isSave) {
                        //     // compileSrc.savePath = _this.dir + path.sep + _this.PATH.SRC + path.sep + compileSrc.subPath.replace('.hbs','');
                        //     compileSrc.savePath = _this.used.dir + path.sep + _this.DIR.PUB + path.sep + subPath;
                        // }
                        content = compileSrc._compile(localData, isSave);
                        return isSave === true ? '' : content + '\n';
                    }
                }
            }
            // ns.group
            for (let ii = 0; ii < outTemplate.group.count; ii++) {
                if (outTemplate.group[ii].isPublic == true) {
                    delimiter = outTemplate.DELIMITER.PART;
                    key = 'ns' + delimiter + alias + delimiter + this.AREA.GROUP.toLowerCase() + delimiter + outTemplate.group[ii].alias;
                    obj['part'][key] = function(data, hb) {
                        
                        let localData = {};
                        let pageGroup = outTemplate.group[ii];
                        let args;
                        // let content, isSave;

                        for (let prop in data) {
                            if (!data._parent[prop]) localData[prop] = data[prop];
                        }
                        // isSave = typeof localData.dir === 'undefined' ? false : true;
                        // if (isSave) {
                        //     compileSrc.savePath = _this.dir + path.sep + _this.PATH.SRC + path.sep + compileSrc.subPath.replace('.hbs','');
                        // }
                        // content = compileSrc._compile(localData, isSave);
                        // return isSave === true ? '' : content + '\n';
                        if (typeof localData['args'] === 'string') {
                            // args = 
                            args = localData['args'].split(',');
                            args = args.map(val => val.trim()); // 문자열 공백 제거
                            localData['args'] = args;
                        }
                        // this 의 현재 폴더를 기준으로 변경
                        pageGroup.build(localData, _this);
                        return '';
                    }
                }
            }
        }
        // ns.helper
        for(let i = 0; i < this.namespace.count; i++) {
            outTemplate = this.namespace[i];
            alias = this.namespace.propertyOf(i);
            for (let ii = 0; ii < outTemplate.helper.count; ii++) {
                if (outTemplate.helper[ii].isPublic == true) {
                    delimiter = outTemplate.DELIMITER.HELPER;
                    key = 'ns' + delimiter + alias + delimiter + outTemplate.helper[ii].alias;
                    obj['helper'][key] = outTemplate.helper[ii].content;
                }
            }
        }
        // ns.data
        for(let i = 0; i < this.namespace.count; i++) {
            outTemplate = this.namespace[i];
            alias = this.namespace.propertyOf(i);
            for (let ii = 0; ii < outTemplate.data.count; ii++) {
                if (outTemplate.data[ii].isPublic == true) {
                    delimiter = outTemplate.DELIMITER.DATA;
                    outAlias = outTemplate.data[ii].alias;
                    key = 'ns' + delimiter + alias + delimiter + outAlias;
                    if (delimiter === '.') { // 객체형으로 리턴
                        obj['data']['ns'] = {};
                        obj['data']['ns'][alias] = {};
                        obj['data']['ns'][alias][outAlias] = outTemplate.data[ii].content;
                    } else {    
                        obj['data'][key] = outTemplate.data[ii].content;
                    }
                }
            }
        }
        return obj;
    }

    /**
     * 빌드파일 추가
     * @param {string} savePath 저장파일 경로
     * @param {string} type cover: 부모, 출판
     */
    _addBuildFile(savePath, type) {
        if (type === 'cover' && !this._buildFile['cover'].find(val => val.tar === savePath.tar)) {
            this._buildFile['cover'].push(savePath);
        // } else if (type === 'publish' && this._buildFile['publish'].indexOf(savePath) < 0) {
        } else if (type === 'publish' && !this._buildFile['publish'].find(val => val.tar === savePath.tar)) {
            this._buildFile['publish'].push(savePath);
        }
    }

    /**
     * 
     * @param {string?} buildFile 빌드파일들 저장 경로
     */
    _saveBuildFile(buildFile) {
        
        let savePath, data, dir = this.used.dir;

        savePath = buildFile ? dir + path.sep + buildFile : dir + path.sep + this.FILE.BUILD;
        data = JSON.stringify(this._buildFile, null, '\t');

        fs.writeFileSync(savePath, data, 'utf8');
        console.log(`빌드파일 저장 : ${savePath} `)
    }

    /**
     * 부모의 객체를 가져와 파일로 쓰다
     *  helper, data, part, src
     */
    _writeParentObject() {
        // console.log('보모 객체 및 파일 덮어쓰기');

        let _this = this;
        let data, dirname;

        // function __copySource(collection, dir) {
            
        //     let  fullPath, savePath;
            
        //     for (let i = 0; i < collection.count; i++) {
        //         fullPath = collection[i].fullPath;
        //         savePath = dir + path.sep + collection[i].localPath;
        //         if (!fs.existsSync(savePath)) {
        //             dirname = path.dirname(savePath);   
        //             if(!fs.existsSync(dirname)) {
        //                 fs.mkdirSync(dirname, {recursive: true} );  // 디렉토리 만들기
        //             }
        //             fs.copyFileSync(fullPath, savePath);
        //             // cover 빌르 파일 [로그]
        //             _this._addBuildFile(savePath, 'cover');
        //         }
        //     }    
        // }
        // POINT:

        function __copySource(collection, dir) {
            
            let  src, filePath, copyFilePath;
            
            for (let i = 0; i < collection.count; i++) {
                src = collection[i];
                filePath = src.filePath;
                if (filePath === null) continue;    // 파일인 경우만
                copyFilePath = dir + path.sep + src.localDir + path.sep + src.fileName;
                if (filePath !== null && !fs.existsSync(copyFilePath)) {
                    // 디렉토리 없으면 만들기
                    dirname = path.dirname(copyFilePath);   
                    if(!fs.existsSync(dirname)) {
                        fs.mkdirSync(dirname, {recursive: true} );
                    }
                    fs.copyFileSync(filePath, copyFilePath);
                    // fs.writeFileSync(filePath, src.content, 'utf-8');
                    // cover 빌르 파일 [로그]
                    _this._addBuildFile({ori: filePath, tar: copyFilePath} , 'cover');
                }
            }    
        }

        // helper, data, part, src 가져오기
        __copySource(this.helper, this.dir);
        __copySource(this.data, this.dir);        
        __copySource(this.part, this.dir);        
        __copySource(this.src, this.dir);  
        __copySource(this.page, this.dir);        

        // 빌드 파일 저장
        this._saveBuildFile();

    }

    // _lookupSource(filePath) {
        
    //     let source, _this = this;
        
    //     function __lookupCollection(col) {
    //         let srcFilePath;
    //         for (let i = 0; i < col.count; i++) {
    //             if (!col[i].fileName) return;   // 상속이나 커버로 생성한게 아닌 경우
    //             srcFilePath = _this.dir + path.sep + col[i].localDir + path.sep + col[i].fileName;
    //             if (filePath === srcFilePath) return col[i];                
    //         }
    //     }
    //     source = __lookupCollection(this.helper);
    //     if (source) return source;
    //     source = __lookupCollection(this.data);
    //     if (source) return source;
    //     source = __lookupCollection(this.part);
    //     if (source) return source;
    //     source = __lookupCollection(this.src);
    //     if (source) return source;
    //     source = __lookupCollection(this.page);
    //     if (source) return source;
    // }
    
    /*_______________________________________*/
    // event caller
    _onInit(template, auto) {
        this.#event.publish('init', template, auto);
    }
    _onInited(template, auto) {
        this.#event.publish('inited', template, auto);
    }
    _onBuild(template, auto) {
        this.#event.publish('build', template, auto);
    }
    _onBuilded(template, auto) {
        this.#event.publish('builded', template, auto);
    }
}

/**
 *  외부(오토템플릿)컬렉션 클래스
 */
class NamespaceCollection extends PropertyCollection {
    
    _owner = null;
    
    /**
     * 네임스페이스컬렉션, import한 외부 Tempalate들
     * @param {AutoTemplate} owner 오토템플릿
     */
    constructor(owner) {
        super(owner);
        this._owner = owner;
    }

    /**
     * 오토템플릿 추가
     * @override
     * @param {string} alias 
     * @param {AutoTemplate} obj 
     */
    add(alias, template) {
        
        if (typeof alias !== 'string') new Error('alias string 타입만 설정할 수 있습니다.');
        if (alias.length === 0) new Error('alias 빈문자열을 삽입 할 수 없습니다.');
        // 템플릿 검사
        if (!(template instanceof AutoTemplate)) new Error('AutoTemplate 타입만 설정할 수 있습니다.');
        // 템플릿 사용위치 설정
        template.used = this._owner.used;
        // 부모 호출
        super.add(alias, template);
    }

}


exports.AutoTemplate = AutoTemplate;