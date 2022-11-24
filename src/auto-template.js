const { PropertyCollection, Observer } = require('entitybind');
const { TemplateSource, TemplateCollection } = require('./source-template');
const { CompileSource, CompileCollection } = require('./source-compile');

/**
 * 오토템플릿 클래스
 */
class AutoTemplate {
    /*_______________________________________*/
    // public
    outer   = new OuterCollection(this);
    helper  = new TemplateSource(this);
    data    = new TemplateSource(this);
    part    = new CompileCollection(this);
    src     = new CompileCollection(this);

    AREA = {
        HELPER: 'helper',
        DATA: 'data',
        PART: 'part',
        SRC: 'src',
    };
    GLOB = {
        HELPER: 'template/helper/**/*.js',
        DATA: 'template/data/**/*.{js,json}',
        PART: 'template/part/**/*.{hbs,js}',
        SRC: 'src/**/*.hbs',
    };
    DELIMITER = {
        HELPER: '-',
        DATA: '.',
        PART: '/',
        SRC: '/',
    };

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
        if (this.isFinal === true && this.#dir.length > 0) throw new Error('최종 오토 (상속금지)는 dir 설정할 수 없습니다.');
        this.#dir.push(val);
        // this.#loadDir(val);
    }
    get dirs() {
        return this.#dir;
    }
    // 생성자
    constructor(dir) {
        this.dir = dir;     // Automation 설정시 사용
    }

    init() {
        this.helper.addPath(this.AREA.HELPER);
        this.data.addPath(this.AREA.DATA);
        this.part.addPath(this.AREA.PART);
        this.src.addPath(this.AREA.SRC);
    }

    build() {
        // 초기화
        this.init();
    }

    import(template, alias) {}

    export() {}
}

/**
 *  외부(오토템플릿)컬렉션 클래스
 */
class OuterCollection extends PropertyCollection {
    constructor() {
        
    }
    /*_______________________________________*/
    // public method

    /*_______________________________________*/
    // private method
    #loadDir(dir) {
    }
}

exports.AutoTemplate = AutoTemplate;
