const path                      = require('path');
const glob                      = require('glob');
const { PropertyCollection }    = require('entitybind');
// import path from "path";
// import glob from "glob";
// import { PropertyCollection } from "entitybind";


// const { PropertyCollection, MetaElement }    = require('entitybind');

/**
 * 템플릿소스 클래스
 */
// class TemplateSource extends MetaElement {
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
    get fullPath() { return path.join(this.#dir, this.localPath); }
    get areaDir() { return this._template.DIR[this.#area]; }
    get subDir() { return path.dirname(this.#subPath) === '.' ? '' : path.dirname(this.#subPath); }
    get subPath() { return this.#subPath; }
    get localDir() { return this.subDir === '' ? this.areaDir : path.join(this.areaDir, this.subDir); }
    get localPath() { return path.join(this.areaDir, this.subPath); }
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
        // super(alias);
        // super();

        let delimiter;
        
        this._template = template;
        this.#dir = dir;
        this.#area = area;
        this.#alias = alias;
        this.isPublic = this._template.defaultPublic;
        delimiter = template.DELIMITER[area];
        this.#subPath = alias.replaceAll(delimiter, path.sep);
        this.#filePath = filePath;
    }

    getObject() {
        let obj = {
            isPublic: this.isPublic,
            content: this.content,
            dir: this.dir,
            area: this.area,
            fullPath: this.fullPath,
            areaDir: this.areaDir,
            subDir: this.subDir,
            subPath: this.subPath,
            localDir: this.localDir,
            localPath: this.localPath,
            name: this.name,
            fileName: this.fileName,
            filePath: this.filePath,
        };
        return obj;
    }     

    clone() {
        const clone = new TemplateSource(this._template, this.#dir, this.#area, this.#alias, this.#filePath);
        
        clone.isPublic  = this.isPublic;
        clone.content   = this.content;
        clone._template = this._template;
        clone._ref      = this._ref;
        return clone;
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
     * TODO: this.add('별칭', out.part['sss'] 삽입시)
     * @param {string | TemplateSource} obj 별칭
     * @param {function | object | TemplateSource} value  대상
     * @param {*?} filePath glob를 통해서 입력한 경우만 
     * @param {string?} dir 
     * @override 상위 add(..) 호출함
     */
    add(obj, value, filePath = null, dir = this._owner.dir) {
        let tarSrc, content;
        let alias;

        // 초기값 설정
        // content = obj instanceof TemplateSource ? obj.content : obj;
        if (obj instanceof TemplateSource) {
            alias = obj.alias;
            value = obj;
        } else alias = obj;

        if (obj instanceof TemplateSource) {
            // content = function(data, hb) { 
            //     return value._compile(data, false);
            // }
            content = obj.content;
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
            // alias = collection.propertyOf(i);
            // this.add(alias, collection[i]);
            this.add(collection[i]);
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
            localPattern = path.join(dirs[i], pattern);
            arrPath = glob.sync(localPattern);
            arrPath.forEach(val => { 
                subPath = path.relative(path.join(dirs[i], areaDir), val)
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
            set: function(val) {
                let content;
                
                if (val instanceof TemplateSource) content = val.content;
                else content = val;

                if (this.area === 'DATA' && !(typeof content === 'function' || typeof content === 'object')) {
                    throw new Error('area[DATA] 가능한 타입 : object(null 제외), function');
                } else if (this.area === 'HELPER' && !(typeof content === 'function')) {
                    throw new Error('area[HELPER] 가능한 타입 : function');
                }
                this._element[idx].content = content;

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