const { PropertyCollection, Observer } = require('entitybind');
const { TemplateSource, TemplateCollection } = require('./source-template');
const { CompileSource, CompileCollection } = require('./source-compile');

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
    TEMP_EXT = '.hbs';
    defaultPublic = true;
    isFinal         = false;    // 상속 금지 설정
    
    outer   = null;
    helper  = null;
    data    = null;
    part    = null;
    src     = null;
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

    /*_______________________________________*/        
    // event property

    // 생성자
    constructor(dir) {
        this.dir = dir;     // Automation 설정시 사용

        this.outer   = new OuterCollection(this);
        this.helper  = new TemplateCollection(this, this.AREA.HELPER);
        this.data    = new TemplateCollection(this, this.AREA.DATA);
        this.part    = new CompileCollection(this, this.AREA.PART);
        this.src     = new CompileCollection(this, this.AREA.SRC);
    }

    /*_______________________________________*/        
    // public method

    init() {
        // this.helper.addPath(this.AREA.HELPER);
        // this.data.addPath(this.AREA.DATA);
        // this.part.addPath(this.AREA.PART);
        // this.src.addPath(this.AREA.SRC);
        this.helper.addGlob(this.GLOB.HELPER);
        this.data.addGlob(this.GLOB.DATA);
        this.part.addGlob(this.GLOB.PART);
        this.src.addGlob(this.GLOB.SRC);

    }

    build() {
        // 초기화
        this.init();

        for (let i = 0; i < this.src.count; i++) {
            this.src[i].compile();
        }

    }

    import(alias, template) {
        
        // const outer = template.export();
        // this.outer.add(alias, outer);
        this.outer.add(alias, template);
    }

    // export(alias) {
        
    //     let _this = this;
    //     let obj = {};
    //     let key = '';
    //     let delmiter = '';

    //     for (let i = 0; i < this.part.count; i++) {
    //         if (this.part[i].isPublic == true) {
    //             delmiter = this.DELIMITER.PART;
    //             key = 'part' + delmiter + this.part.propertyOf(i);
    //             obj[key] = function(data, hb) {
    //                 let localData = {};
    //                 for (let prop in data) {
    //                     if (!data._parent[prop]) localData[prop] = data[prop];
    //                 }
    //                 var template = _this.wax.compile(_this.src+ key);
    //                 return template(localData);
    //             }
    //         }
    //     }
    //     for (let i = 0; i < this.helper.count; i++) {
    //         if (this.helper[i].isPublic == true) {
    //             delmiter = this.DELIMITER.HELPER;
    //             key = 'helper' + delmiter + this.helper.propertyOf(i);
    //             obj[key] = this.helper[i].content;
    //         }
    //     }
    //     for (let i = 0; i < this.part.count; i++) {
    //         if (this.part[i].isPublic == true) {
    //             delmiter = this.DELIMITER.HELPER;
    //             key = 'data' + delmiter + this.part.propertyOf(i);
    //             obj[key] = function(data, hb) {
    //                 let localData = {};
    //                 for (let prop in data) {
    //                     if (!data._parent[prop]) localData[prop] = data[prop];
    //                 }
    //                 var template = _this.wax.compile(_this.src+ key);
    //                 return template(localData);
    //             }
    //         }
    //     }

    //     return obj;
    // }

    /*_______________________________________*/        
    // protected method
    _getOuterScope() {

        let obj = {};
        let key = '';
        let delmiter = '';
        let template;
        let alias;

        for(let i = 0; i < this.outer.count; i++) {
            template = this.outer[i];
            alias = this.outer.propertyOf(i);
            for (let ii = 0; ii < template.part.count; ii++) {
                if (template.part[i].isPublic == true) {
                    delmiter = template.DELIMITER.PART;
                    key = alias + delmiter + template.part.alias;
                    obj['part'][key] = function(data, hb) {
                        let localData = {};
                        for (let prop in data) {
                            if (!data._parent[prop]) localData[prop] = data[prop];
                        }
                        var template = _this.wax.compile(_this.src+ key);
                        return template(localData);
                    }
                }
            }
        }
        for(let i = 0; i < this.outer.count; i++) {
            template = this.outer[i];
            alias = this.outer.propertyOf(i);
            for (let ii = 0; ii < template.helper.count; ii++) {
                if (template.helper[i].isPublic == true) {
                    delmiter = template.DELIMITER.PART;
                    key = alias + delmiter + template.helper.alias;
                    obj['helper'][key] = template.helper[i].content;
                }
            }
        }
        for(let i = 0; i < this.outer.count; i++) {
            template = this.outer[i];
            alias = this.outer.propertyOf(i);
            for (let ii = 0; ii < template.data.count; ii++) {
                if (template.data[i].isPublic == true) {
                    delmiter = template.DELIMITER.PART;
                    key = alias + delmiter + template.data.alias;
                    obj['data'][key] = template.data[i].content;
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
}

/**
 *  외부(오토템플릿)컬렉션 클래스
 */
class OuterCollection extends PropertyCollection {
    constructor(owner) {
        super(owner);
    }
    /*_______________________________________*/
    // public method

    /*_______________________________________*/
    // private method
    #loadDir(dir) {
    }
}

exports.AutoTemplate = AutoTemplate;
