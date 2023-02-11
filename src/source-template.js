const path                      = require('path');
const glob                      = require('glob');
const { PropertyCollection }    = require('entitybind');

/**
 * 템플릿소스 클래스
 */
class TemplateSource {
    
    /*_______________________________________*/        
    // public
    isPublic = true;    // export기 노출 여부
    content = null;

    /*_______________________________________*/        
    // protected
    _template = null;
    _ref = null;

    /*_______________________________________*/        
    // private
    #dir = '';
    #area = '';
    #alias = '';
    #subPath = '';
    // #fullPath = '';
    #filePath = null;

    /*_______________________________________*/        
    // property
    get dir() { return this.#dir; }
    get area() { return this.#area; }
    get alias() { return this.#alias; }
    // POINT:
    // get fullPath() { return this.#fullPath; }
    // get areaDir() { return this._template.DIR[this.#area]; }
    // get subDir() { return path.dirname(this.subPath) === '.' ? '' : path.dirname(this.subPath); }
    // get subPath() { return path.relative(this.dir + path.sep + this.areaDir, this.fullPath); }
    // get localDir() { return this.areaDir + path.sep + this.subDir; }
    // get localPath() { return this.areaDir + path.sep + this.subPath; }
    // get name() { return path.basename(this.fullPath); }
    get fullPath() { return this.#dir + path.sep + this.localPath; }
    get areaDir() { return this._template.DIR[this.#area]; }
    get subDir() { return path.dirname(this.#subPath) === '.' ? '' : path.dirname(this.#subPath); }
    get subPath() { return this.#subPath; }
    get localDir() { return this.subDir === '' ? this.areaDir : this.areaDir + path.sep + this.subDir; }
    get localPath() { return this.areaDir + path.sep + this.subPath; }
    get name() { return path.basename(this.#subPath); }
    get fileName() { return this.#filePath !== null ? path.basename(this.#filePath) : null; }
    get filePath() { return this.#filePath; }

    /**
     * 템플릿소스 생성자
     * @param {AutoTemplate} owner 소속된 템플릿
     * @param {*} area 구역코드
     * @param {*} alias 별칭
     * @param {*?} fullPath 전체경로(최상위부터)
     */
    constructor(template, dir, area, alias, filePath = null) {
        
        let delimiter;
        
        this._template = template;
        this.#dir = dir;
        this.#area = area;
        this.#alias = alias;
        this.isPublic = this._template.defaultPublic;
        // POINT: 하단 추가
        // if (fullPath !== null) {
        //     this.#fullPath = fullPath;
        // }
        delimiter = template.DELIMITER[area];
        this.#subPath = alias.replaceAll(delimiter, path.sep);
        this.#filePath = filePath;
    }
}

/**
 * 템플릿컬렉션 클래스
 */
class TemplateCollection extends PropertyCollection {
    
    area = null;
    _owner = null;

    /**
     * 템플릿컬렉션 생성자
     * @param {AutoTemplate} owner 소유자
     * @param {string} area 구역코드
     */
    constructor(owner, area) {
        super(owner);
        this.area = area;
        this._owner = owner;
    }
    
    /*_______________________________________*/
    // public method
    /**
     * 컬렉션에 객체를 생성하여 추가
     * @param {*} alias 별칭
     * @param {function | object | TemplateSource} obj  대상
     * @param {*?} fullPath glob를 통해서 입력한 경우만 
     * @param {string?} dir 
     * @overloading 상위 add(..) 호출함
     */
    // POINT:
    // add(alias, obj, fullPath = null, dir = this._owner.dir) {
        
    //     // const localDir = this._owner.AREA[this.area];
    //     const localDir = this._owner.DIR[this.area];
    //     let tarSrc;

    //     // 유효성 검사
    //     if (typeof alias !== 'string' || alias.length === 0) {
    //         throw new Error('alias에 string 만 지정할 수 있습니다.');
    //     }
    //     if (typeof obj === 'undefined' || obj === null) {
    //         throw new Error('obj에 null 또는 undefined 지정할 수 없습니다. ');
    //     }
    //     if (this.area === 'DATA' && !(typeof obj === 'function' || typeof obj === 'object')) {
    //         throw new Error('area[DATA] 가능한 타입 : object(null 제외), function');
    //     }
    //     if (this.area === 'HELPER' && !(typeof obj === 'function')) {
    //         throw new Error('area[HELPER] 가능한 타입 : function');
    //     }

    //     // POINT:
    //     // TODO: this.add('별칭', out.part['sss'] 삽입시)
    //     if (obj instanceof TemplateSource) {
    //         fullPath = obj.fullPath ?? dir + path.sep + localDir + path.sep + obj.subPath;
    //         tarSrc = new TemplateSource(this._owner, dir, this.area, alias, fullPath);
    //         tarSrc.content = obj.content;
    //     } else {
    //         tarSrc = new TemplateSource(this._owner, dir, this.area, alias, fullPath);
    //         tarSrc.content = obj;
    //     }

    //     super.add(alias, tarSrc);
    // }

    /**
     * 컬렉션에 객체를 생성하여 추가
     * @param {string | TemplateSource} obj 별칭
     * @param {function | object | TemplateSource} value  대상
     * @param {*?} filePath glob를 통해서 입력한 경우만 
     * @param {string?} dir 
     * @overloading 상위 add(..) 호출함
     */
    add(obj, value, filePath = null, dir = this._owner.dir) {
        
        // const localDir = this._owner.AREA[this.area];
        // const localDir = this._owner.DIR[this.area];
        let tarSrc, content;
        let alias;

        // 초기값 설정
        // content = obj instanceof TemplateSource ? obj.content : obj;
        if (obj instanceof TemplateSource) {
            alias = obj.alias;
            value = obj;
        } else alias = obj;

        if (obj instanceof TemplateSource) {
            content = function(data, hb) {
                return value._compile(data, false);
            }
        } else content = value;


        // 유효성 검사
        if (typeof alias !== 'string' || alias.length === 0) {
            throw new Error('alias에 string 만 지정할 수 있습니다.');
        }
        if (typeof content === 'undefined' || content === null) {
            throw new Error('obj에 null 또는 undefined 지정할 수 없습니다. ');
        }
        // area별 타입 검사
        if (this.area === 'DATA' && !(typeof content === 'function' || typeof content === 'object')) {
            throw new Error('area[DATA] 가능한 타입 : object(null 제외), function');
        } else if (this.area === 'HELPER' && !(typeof content === 'function')) {
            throw new Error('area[HELPER] 가능한 타입 : function');
        }

        // TODO: this.add('별칭', out.part['sss'] 삽입시)
        // if (obj instanceof TemplateSource) {
        //     fullPath = obj.fullPath ?? dir + path.sep + localDir + path.sep + obj.subPath;
        //     tarSrc = new TemplateSource(this._owner, dir, this.area, alias, filePath);
        //     tarSrc.content = obj.content;
        // } else {
        //     tarSrc = new TemplateSource(this._owner, dir, this.area, alias, filePath);
        //     tarSrc.content = obj;
        // }

        tarSrc = new TemplateSource(this._owner, dir, this.area, alias, filePath);
        tarSrc.content = content;

        super.add(alias, tarSrc);
    }

    /**
     * 컬렉션 타입 추가하기
     * @param {*} collection 
     */
    addCollection(collection) {
        
        let alias;
        
        for (let i = 0; i < collection.count; i++) {
            alias = collection.propertyOf(i);
            this.add(alias, collection[i]);
        }
    }

    /**
     * glob 패턴으로 복수의 경로의 파일을 컬렉션에 추가히기
     * @param {*} pattern js, json
     * @param {*} opt TODO:: glob 옵션으로 활용
     */
    addGlob(pattern, opt) {
        
        const _this = this;
        const sep = path.sep;
        const dirs = this._onwer.dirs;
        const delmiter = this._owner.DELIMITER[this.area];
        const areaDir = this._owner.DIR[this.area];
        let arrPath = [];
        let localPattern, alias, content, subPath, idx;

        for (let i = 0; i < dirs.length; i++) {
            localPattern = dirs[i] + sep + pattern;
            arrPath = glob.sync(localPattern);
            arrPath.forEach(val => { 
                subPath = path.relative(dirs[i] + sep + areaDir, val)
                alias = _this._makeAlias(subPath);
                content = require(val);

                idx = _this.indexOfName(alias);  // 중복이름 검사
                
                if (idx > -1) { // 컬렉션이 존재할 경우
                    // _this[idx] = new TemplateSource(_this._owner, dirs[i], this.area, alias, val);
                    // _this[idx].content = content;
                    _this._setElement(idx, new TemplateSource(_this._owner, dirs[i], this.area, alias, val));
                    _this[idx].content = content;
                } else {
                    _this.add(alias, content, val, dirs[i]);
                }
                // _this.add(alias, content, val, dirs[i]);
            });
        }
    }

    /*_______________________________________*/
    // protected method
    /**
     * subPath를 입력받이서 별칭로 만들기
     * @param {*} subPath 
     * @returns {string} 별칭
     */
    _makeAlias(subPath) {
        
        const delmiter = this._owner.DELIMITER[this.area];
        let fileName, dir;
        
        fileName = path.parse(subPath).name;
        dir = path.parse(subPath).dir;
        dir = dir.replace(/\//g, delmiter);       // 구분 문자 변경
        dir = dir.length > 0 ? dir + delmiter : dir;
        return dir + fileName;
    }

    /**
     * setter 에서 TemplateSource 타입만 받음
     * setter 타입에 따라서 등록위치가 달라짐
     * @param {*} idx  
     * @returns
     * @override 
     */
    _getPropDescriptor(idx) {
        return {
            get: function() { return this._element[idx]; },
            set: function(val) {    // REVIEW: 컬렉션이 임의 삽입 확인필요
                if (val instanceof TemplateSource && val.area === this.area) {
                    this._element[idx].content = val.content;
                } else {
                    throw new Error('TemplateSource 타입만 설정할 수 있습니다.');
                }
            },
            enumerable: true,
            configurable: true
        };
    }

    _setElement(idx, elem) {
        this._element[idx] = elem;
    }
}

exports.TemplateSource = TemplateSource;
exports.TemplateCollection = TemplateCollection;