const fs                                = require('fs');
const path                              = require('path');
const { PropertyCollection, Observer }  = require('entitybind');
const { TemplateCollection }            = require('./source-template');
const { CompileCollection }             = require('./source-compile');

/**
 * 오토템플릿 클래스
 */
class AutoTemplate {
    /*_______________________________________*/
    // public
    AREA = {
        HELPER: 'helper',
        DATA: 'data',
        PART: 'part',
        PAGE: 'page',
        SRC: 'src',
        PUB: 'pub',
    };
    PATH = {
        HELPER: 'template/helper',
        DATA: 'template/data',
        PART: 'template/part',
        PAGE: 'template/page',
        SRC: 'src',
        PUB: 'src',
    }
    DELIMITER = {
        HELPER: '-',
        DATA: '.',
        PART: '/',
        PAGE: '/',
        SRC: '/',
    };
    GLOB = {
        HELPER: 'template/helper/**/*.js',
        DATA: 'template/data/**/*.{js,json}',
        PART: 'template/part/**/*.{hbs,js}',
        PAGE: 'template/page/**/*.{hbs,js}',
        SRC: 'src/**/*.hbs',
    };
    FILE = {
        BUILD: '__BuildFile.json'
    };
    TEMP_EXT        = '.hbs';
    defaultPublic   = true;
    isFinal         = false;    // 상속 금지 설정
    // namespace       = null;
    // helper          = null;
    // data            = null;
    // part            = null;
    // src             = null;
    
    /*_______________________________________*/
    // protected
    _auto = null
    _buildFile = {
        cover: [],
        publish: [],
    }
    _localScope = null;
    _outerScope = null;

    /*_______________________________________*/
    // private
    #dir                = [];
    #event              = new Observer(this, this);
    #namespace          = null;
    #helper             = null;
    #part               = null;
    #data               = null;
    #src                = null;
    #page               = null;
    #group              = null;
    /*_______________________________________*/        
    // property
    get dir() {
        let size = this.#dir.length;
        if (size === 0) throw new Error(' start [dir] request fail...');
        return this.#dir[size - 1];
    }
    set dir(val) {
        if (this.isFinal === true && this.#dir.length > 0) throw new Error('마지막 클래스(상속금지)는 dir 설정할 수 없습니다.');
        if (this.#dir.indexOf(val) < 0) this.#dir.push(val);
    }
    get dirs() { return this.#dir; }
    get namespace() { return this.#namespace }
    get helper() { return this.#helper }
    set helper(val) {
        if (val instanceof TemplateCollection) this.#helper.addCollectoin(val);
        else throw new Error('TemplateCollection 타입만 설정할 수 있습니다.');
    }
    get part() { return this.#part }
    set part(val) {
        if (val instanceof CompileCollection) this.#part.addCollectoin(val);
        else throw new Error('CompileCollection 타입만 설정할 수 있습니다.');
    }
    get data() { return this.#data }
    set data(val) {
        if (val instanceof TemplateCollection) this.#data.addCollectoin(val);
        else throw new Error('TemplateCollection 타입만 설정할 수 있습니다.');
    }
    get src() { return this.#src }
    set src(val) {
        if (val instanceof CompileCollection) this.#src.addCollectoin(val);
        else throw new Error('CompileCollection 타입만 설정할 수 있습니다.');
    }
    get page() { return this.#page }
    set page(val) {
        if (val instanceof CompileCollection) this.#page.addCollectoin(val);
        else throw new Error('CompileCollection 타입만 설정할 수 있습니다.');
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
        this.dir        = dir;      // Automation 설정시 사용
        this._auto      = auto;     // Automation 설정시 사용
        this.#namespace = new NamespaceCollection(this);
        this.#helper    = new TemplateCollection(this, this.AREA.HELPER);
        this.#data      = new TemplateCollection(this, this.AREA.DATA);
        this.#part      = new CompileCollection(this, this.AREA.PART);
        this.#src       = new CompileCollection(this, this.AREA.SRC);
        this.#page      = new CompileCollection(this, this.AREA.PAGE);
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

        // 네임스페이스 초기화
        for (let i = 0; i< this.namespace.count; i++) {
            this.namespace[i].init();
        }
        
        // 지역 초기화
        this.helper.addGlob(this.GLOB.HELPER);
        this.data.addGlob(this.GLOB.DATA);
        this.part.addGlob(this.GLOB.PART);
        this.src.addGlob(this.GLOB.SRC);
        this.page.addGlob(this.GLOB.PAGE);

        // 빌드 스코스 설정
        this._localScope = this._getLocalScope();
        this._outerScope = this._getOuterScope();

        // 이벤트 발생
        this._onInited(this, this._auto);

        if (fs.existsSync(this.dir + path.sep + this.FILE.BUILD)) {
            buildFile = require(this.dir + path.sep + this.FILE.BUILD);
            if (buildFile.cover) this._buildFile['cover'] = buildFile.cover;
            if (buildFile.publish) this._buildFile['publish'] = buildFile.publish;
        }

        // 사옹자 정의 초기화 호출
        this.ready();
    }

    /**
     * 깨끗이 지운다. 생성파일을 삭제한다.
     */
    clear() {

        const buildFile = this.dir + path.sep + this.FILE.BUILD;
        let filePath;

        // 파일 삭제
        for (let i = 0; i < this._buildFile['cover'].length; i++) {
            filePath = this._buildFile['cover'][i];
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        for (let i = 0; i < this._buildFile['publish'].length; i++) {
            filePath = this._buildFile['publish'][i];
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        if (fs.existsSync(buildFile)) fs.unlinkSync(buildFile);
        
        // 속성 초기화
        this._batchFile = {
            cover: [],
            publish: [],
        };

    }

    /**
     * src 에 등록된 소스를 빌드한다.(템플릿을 컴파일한다.)
     */
    buildSource() {
        // 초기화
        // this.init();
        
        // 이벤트 발생
        this._onBuild(this, this._auto);

        // 소스 컴파일
        for (let i = 0; i < this.src.count; i++) {
            this.src[i].compile();
        }
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
        // 외부 템플릿 초기화
        // template.init();
        // 외부 템플릿 등록
        this.namespace.add(alias, template);
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
        // part.page 로딩
        for (let i = 0; i < this.page.count; i++) {
            delimiter = this.DELIMITER.PAGE;
            alias = this.page[i].alias;
            key = this.AREA.PAGE + delimiter + alias;
            
            obj['part'][key] = function(data, hb) {
                let localData = {};
                let compileSrc = _this.page[i];
                let content, isSave;
                
                for (let prop in data) {
                    if (!data._parent[prop]) localData[prop] = data[prop];
                }
                // savePath 경로르 변경 : dir 지정 시 파일별도생성
                isSave = typeof localData.dir === 'undefined' ? false : true;
                // 단독저장의 경우 파일경로를 수정함
                if (isSave) {
                    compileSrc.savePath = _this.dir + path.sep + _this.PATH.SRC + path.sep + compileSrc.subPath.replace('.hbs','');
                }
                content = compileSrc.compile(localData, isSave);
                
                return isSave === true ? '' : content + '\n';
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

        let obj = { part: {}, helper: {}, data: {} };
        let key, delimiter, outTemplate, alias, outAlias;

        for(let i = 0; i < this.namespace.count; i++) {
            outTemplate = this.namespace[i];
            alias = this.namespace.propertyOf(i);
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
                        content = compileSrc.compile(localData, false);
                        return content + '\n';
                    }
                }
            }
        }
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
        if (type === 'cover' && this._buildFile['cover'].indexOf(savePath) < 0) {
            this._buildFile['cover'].push(savePath);
        } else if (type === 'publish' && this._buildFile['publish'].indexOf(savePath) < 0) {
            this._buildFile['publish'].push(savePath);
        }
    }

    /**
     * 
     * @param {string?} buildFile 빌드파일들 저장 경로
     */
    _saveBuildFile(buildFile) {
        
        let savePath, data;

        savePath = buildFile ? this.dir + path.sep + buildFile : this.dir + path.sep + this.FILE.BUILD;
        data = JSON.stringify(this._buildFile, null, '\t');

        fs.writeFileSync(savePath, data, 'utf8');
    }

    /**
     * 부모의 객체를 가져와 파일로 쓰다
     *  helper, data, part, src
     */
    _writeParentObject() {
        // console.log('보모 객체 및 파일 덮어쓰기');

        let _this = this;
        let data, dirname;

        function __copySource(collection, dir) {
            
            let  fullPath, savePath;
            
            for (let i = 0; i < collection.count; i++) {
                fullPath = collection[i].fullPath;
                savePath = dir + path.sep + collection[i].localPath;
                if (!fs.existsSync(savePath)) {
                    dirname = path.dirname(savePath);   
                    if(!fs.existsSync(dirname)) {
                        fs.mkdirSync(dirname, {recursive: true} );  // 디렉토리 만들기
                    }
                    fs.copyFileSync(fullPath, savePath);
                    // cover 빌르 파일 [로그]
                    _this._addBuildFile(savePath, 'cover');
                }
            }    
        }

        // helper, data, part, src 가져오기
        __copySource(this.helper, this.dir);
        __copySource(this.data, this.dir);        
        __copySource(this.part, this.dir);        
        __copySource(this.src, this.dir);        

        // 빌드 파일 저장
        this._saveBuildFile();

    }
    
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
    /**
     * 네임스페이스컬렉션, import한 외부 Tempalate들
     * @param {AutoTemplate} owner 오토템플릿
     */
    constructor(owner) {
        super(owner);
    }
}

/**
 *  구룹컬렉션 클래스
 */
class GroupCollection extends PropertyCollection {
    
    
    /*_______________________________________*/        
    // protected
    _owner = null;
    // all 예약어
    _groupSymbol = [/^[\\\/]?all([\\\/]|$)/];

    /**
     * 네임스페이스컬렉션, import한 외부 Tempalate들
     * @param {AutoTemplate} owner 오토템플릿
     */
    constructor(owner) {
        super(owner);
        this._owner = owner;
    }

    // * this.group.add('spring', [ 
    // *  {page: 'aaa.c', page: '{0}inc/fileA{1}'},   // A 그룹설정
    // *  {page: 'bbb.c', page: '{0}inc/fileB{1}'},   // B 그룹설정
    // * ],
    // * ['A','B']);  // 접두접미사의 기본값

    /**
     * 페이지 그룹 추가
     * @param {string} alias 
     * @param {array<object>} pages 
     * @param {array<string>} defaltFix 
     */
    add(alias, pages, defaltFix) {

        let pg = null;

        // 유효성 검사
        if (typeof alias !== 'string' || alias.length === 0) {
            throw new Error('alias에 string 만 지정할 수 있습니다.');
        }
        if (!Array.isArray(pages)) {
            throw new Error('pages array<object> 만 지정할 수 있습니다.');
        }
        if (!Array.isArray(defaltFix)) {
            throw new Error('alias에 array<object> 만 지정할 수 있습니다.');
        }

        // 별칭 규칙 검사
        this._groupSymbol.forEach(val => {
            if ((val instanceof RegExp && val.test(alias)) || 
                (typeof val === 'string' && val === alias)) {
                throw new Error('[group]에 예약어를 입력할 수 없습니다. : all');
            }
        });

        pg = new PageGroup(this._owner, alias);
        pg.addPage(pages);
        pg.argFix = defaltFix;
        // pg.fixs = ['aa', 'Aa'];
        // pg.prefix = 'aa';
        // pg.suffix = 'BB';

        super.add(alias, pg);
    }

    _setAllPage() {

        // const pg = new PageGroup(this._owner, 'all', pages, defaltFix);
        const pg = new PageGroup(this._owner, 'all');
        let alias;

        for (let i = 0; i < this._owner.page.count; i++) {
            alias = this.this._owner.page.propertyOf(i);
            pg.addPage({ 
                page: alias,
                context: this._owner.page.subPath
            });
        }
        // pg.setFix('');

    }
}

class PageGroup{

    // pages = [];
    // fixs = [];

    // argsFix = [];
    // prefix = null;
    // suffix = null;

    // pages = {
    //     context: '',
    //     src: null
    // };

    /*_______________________________________*/
    // protecrted
    _auto = null;
    _alias = null;
    _pages = [];
    // _force = false;

    /*_______________________________________*/
    // private
    #argFixs = [];
    #prefix = '';
    #suffix = '';

    /*_______________________________________*/        
    // property
    get argFixs() { return this.#argFixs };
    set argFixs(val) {
        if (!Array.isArray(val)) throw new Error('argFixs 가능한 타입 : array ');
        this.#argsFix = val;
    }
    get prefix() { return this.#prefix };
    set prefix(val) {
        if (typeof val !== 'string') throw new Error('prefix 가능한 타입 : string ');
        this.#prefix = val;
    }

    
    constructor(auto, alias) {
        
        // if (typeof fixs !== 'undefined' && !Array.isArray(pages)) {
        //     throw new Error('alias에 array<object> 만 지정할 수 있습니다.');
        // }
        // for (let i = 0; i < pages.length; i++) {
        //     this.pages.push(this.#createPage(pages[i]));
        // }
        this._auto = auto;
        this._alias = alias;
        // this.pages = [...pages];
        // this.fixs = [...fixs];
        // this._force = force;
        // page 의 CompileSoruce 와 연결 => 이건 필수모드가 맞을듯
        // if (this._force !== true) {
        //     this.#linkSource();
        // }
    }

    /**
     * 페이지 개체를 설정한다.
     * @param {object | array} obj 배열 또는 객체
     */
    addPage(obj) {
        
        let arr = [];
        let pageObj, src, alias, context;

        if (Array.isArray(obj)) arr = [...obj];
        else arr.push(obj);

        for (let i = 0; i < arr.length; i++) {
            
            pageObj = arr[i];
            alias = pageObj['page'];
            context = pageObj['context'];
            src = this._auto.page[alias] || null;

            if (src === null){
                throw new Error(`page에  ${alias} 존재하지 않습니다.`);
            }
    
            if (typeof context !== 'string' || context.length === 0) {
                context = src.subPath;  // REVIEW: 이름 매칭 확인필요!
            }
    
            this._pages.push({            
                page: alias,
                context: context,
                src: src
            });
        }

    }

    _setPage(page) {
        // if (!Array.isArray(pages)) {
        //     throw new Error('alias에 array<object> 만 지정할 수 있습니다.');
        // }
        
        // for(let i = 0; i < pages.length; i++) {

        // }
        
        
    }

    _setFix(fix) {

    }
    
    _makePath(context) {
        for (let i = 0; i < this._fixs.length; i++) {
            context += context.replaceAll(`{${i}}`, this._fixs[i]);
        }
        return context;
    }
    
    // #createPage(obj) {
        
    //     const alias = obj['page'];
    //     const context = obj['context'];
    //     const src = this._auto.group[alias] || null;
        
    //     return {
    //         page: alias,
    //         context: context,
    //         src: src
    //     }
    // }

    #linkSource() {
        
        let src = null;

        for (let i = 0; i < this._pages.length; i++) {
            src = this._auto.page[this._pages[i]] || null;
            if (src === null){
                throw new Error(`page에  ${alias} 존재하지 않습니다. build 시점에 로딩이 필요한 경우 생성자 (,,true) 설정하세요.`);
            }
            this._pages[i]['src'] = src;
        }
    }


}


exports.AutoTemplate = AutoTemplate;