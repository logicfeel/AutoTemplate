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
        PUB: 'pub',
    };
    PATH = {
        HELPER: 'template/helper',
        DATA: 'template/data',
        PART: 'template/part',
        SRC: 'src',
        PUB: 'src',
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
    FILE = {
        BUILD: '__BuildFile.json'
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
    _buildFile = {
        conver: [],
        publish: [],
    }
    
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

    /**
     * 오토템플릿 생성자
     * @param {string} dir 시작경로
     * @param {Automation?} auto 소속된 오토메이션
     */
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

        this.helper.addGlob(this.GLOB.HELPER);
        this.data.addGlob(this.GLOB.DATA);
        this.part.addGlob(this.GLOB.PART);
        this.src.addGlob(this.GLOB.SRC);

        // 이벤트 발생
        this._onInited(this, this._auto);

        if (fs.existsSync(this.dir + path.sep + this.FILE.BUILD)) {
            buildFile = require(this.FILE.BUILD);
            this._buildFile['conver'] = buildFile.conver;
            this._buildFile['publish'] = buildFile.publish;
        }

        // 사옹자 정의 초기화 호출
        this.ready();
    }

    /**
     * src 에 등록된 소스를 빌드한다.(템플릿을 컴파일한다.)
     */
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

    /**
     * 외부 AutoTemplate 의 part, helper, data 를 가져온다.
     * src는 제외
     * @param {string} alias 별칭
     * @param {AutoTemplate} template 
     */
    import(alias, template) {
        // 외부 템플릿 초기화
        template.init();
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

    /**
     * 테플릿의 외부범위(import)의 객체를 리턴한다.
     * @returns {object} {part:{..}, helper: {..}, data: {..}}
     */
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
                    if (delmiter === '.') { // 객체형으로 리턴
                        obj['data'][alias] = {};
                        obj['data'][alias][outAlias] = outTemplate.data[ii].content;
                    } else {    
                        obj['data'][key] = outTemplate.data[ii].content;
                    }
                }
            }
        }
        return obj;
    }

    _addBuildFile(savePath, type) {
        if (type === 'conver' && this._buildFile['cover'].indexOf(savePath) < 0) {
            this._buildFile['cover'].push(savePath);
        } else if (type === 'publish' && this._buildFile['publish'].indexOf(savePath) < 0) {
            this._buildFile['publish'].push(savePath);
        }
    }

    _saveBuildFile(buildFile) {
        
        let savePath, data;

        savePath = buildFile ? this.dir + path.sep + buildFile : this.dir + path.sep + this.FILE.BUILD;
        data = JSON.stringify(this._batchFile, null, '\t');

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

        function copySource(collection, dir) {
            
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
        copySource(this.helper, this.dir);
        copySource(this.data, this.dir);        
        copySource(this.part, this.dir);        
        copySource(this.src, this.dir);        
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


exports.AutoTemplate = AutoTemplate;