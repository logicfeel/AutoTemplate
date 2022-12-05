const { PropertyCollection, Observer } = require('entitybind');
const { TemplateCollection } = require('./source-template');
const { CompileCollection } = require('./source-compile');

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
        SRC: 'src',
    };
    PATH = {
        HELPER: 'template/helper',
        DATA: 'template/data',
        PART: 'template/part',
        SRC: 'src',
    }
    DELIMITER = {
        HELPER: '-',
        DATA: '.',
        PART: '/',
        SRC: '/',
    };
    GLOB = {
        HELPER: 'template/helper/**/*.js',
        DATA: 'template/data/**/*.{js,json}',
        PART: 'template/part/**/*.{hbs,js}',
        SRC: 'src/**/*.hbs',
    };
    TEMP_EXT        = '.hbs';
    defaultPublic   = true;
    isFinal         = false;    // 상속 금지 설정
    namespace       = null;
    helper          = null;
    data            = null;
    part            = null;
    src             = null;

    /*_______________________________________*/
    // protected
    _auto = null
    
    /*_______________________________________*/
    // private
    #dir                = [];
    #event              = new Observer(this, this);
    
    /*_______________________________________*/        
    // property
    get dir() {
        let size = this.#dir.length;
        if (size === 0) throw new Error(' start [dir] request fail...');
        return this.#dir[size - 1];
    }
    set dir(val) {
        if (this.isFinal === true && this.#dir.length > 0) throw new Error('마지막 클래스(상속금지)는 dir 설정할 수 없습니다.');
        this.#dir.push(val);
    }
    get dirs() { return this.#dir; }

    /*_______________________________________*/        
    // event property
    set onInit(fn) { this.#event.subscribe(fn, 'init') }        // 초기화 전
    set onInited(fn) { this.#event.subscribe(fn, 'inited') }    // 초기화 전
    set onBuild(fn) { this.#event.subscribe(fn, 'build') }      // 빌드 전
    set onBuilded(fn) { this.#event.subscribe(fn, 'builded') }  // 빌드 전

    /*_______________________________________*/
    // constructor method
    constructor(dir, auto) {
        this.dir        = dir;      // Automation 설정시 사용
        this._auto      = auto;     // Automation 설정시 사용
        this.namespace  = new NamespaceCollection(this);
        this.helper     = new TemplateCollection(this, this.AREA.HELPER);
        this.data       = new TemplateCollection(this, this.AREA.DATA);
        this.part       = new CompileCollection(this, this.AREA.PART);
        this.src        = new CompileCollection(this, this.AREA.SRC);
    }

    /*_______________________________________*/        
    // public method
    ready() {/** 가상함수 */}

    init() {
        // 이벤트 발생
        this._onInit(this, this._auto);

        this.helper.addGlob(this.GLOB.HELPER);
        this.data.addGlob(this.GLOB.DATA);
        this.part.addGlob(this.GLOB.PART);
        this.src.addGlob(this.GLOB.SRC);

        // 이벤트 발생
        this._onInited(this, this._auto);

        // 사옹자 정의 초기화 호출
        this.ready();

    }

    build() {
        // 초기화
        this.init();
        
        // 이벤트 발생
        this._onBuild(this, this._auto);

        // 소스 컴파일
        for (let i = 0; i < this.src.count; i++) {
            this.src[i].compile();
        }

        // 이벤트 발생
        this._onBuilded(this, this._auto);
    }

    import(alias, template) {
        // 외부 템플릿 초기화
        template.init();
        // 외부 템플릿 등록
        this.namespace.add(alias, template);
    }

    /*_______________________________________*/        
    // protected method
    _getOuterScope() {

        let obj = { part: {}, helper: {}, data: {} };
        let key, delmiter, outTemplate, alias, outAlias;

        for(let i = 0; i < this.namespace.count; i++) {
            outTemplate = this.namespace[i];
            alias = this.namespace.propertyOf(i);
            for (let ii = 0; ii < outTemplate.part.count; ii++) {
                if (outTemplate.part[ii].isPublic == true) {
                    delmiter = outTemplate.DELIMITER.PART;
                    key = alias + delmiter + outTemplate.part[ii].alias;
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
                    delmiter = outTemplate.DELIMITER.HELPER;
                    key = alias + delmiter + outTemplate.helper[ii].alias;
                    obj['helper'][key] = outTemplate.helper[ii].content;
                }
            }
        }
        for(let i = 0; i < this.namespace.count; i++) {
            outTemplate = this.namespace[i];
            alias = this.namespace.propertyOf(i);
            for (let ii = 0; ii < outTemplate.data.count; ii++) {
                if (outTemplate.data[ii].isPublic == true) {
                    delmiter = outTemplate.DELIMITER.DATA;
                    outAlias = outTemplate.data[ii].alias;
                    key = alias + delmiter + outAlias;
                    if (delmiter !== '.') { 
                        obj['data'][key] = outTemplate.data[ii].content;
                    } else {    // 객체형으로 리턴
                        obj['data'][alias] = {};
                        obj['data'][alias][outAlias] = outTemplate.data[ii].content;
                    }
                }
            }
        }
        return obj;
    }

    _getLocalScope() {
        
        let obj = { part: {}, helper: {}, data: {} };
        let alias;

        for (let i = 0; i < this.part.count; i++) {
            alias = this.part[i].alias;
            obj['part'][alias] =  this.part[i].content;
        }
        for (let i = 0; i < this.helper.count; i++) {
            alias = this.helper[i].alias;
            obj['helper'][alias] =  this.helper[i].content;
        }
        for (let i = 0; i < this.data.count; i++) {
            alias = this.data[i].alias;
            obj['data'][alias] =  this.data[i].content;
        }
        return obj;
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
    constructor(owner) {
        super(owner);
    }
}

exports.AutoTemplate = AutoTemplate;
