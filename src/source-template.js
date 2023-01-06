const path = require('path');
const glob = require('glob');
const { PropertyCollection } = require('entitybind');

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
    _owner = null;

    /*_______________________________________*/        
    // private
    #fullPath = '';
    #area = '';
    #alias = '';
    #dir = '';

    /*_______________________________________*/        
    // property
    get dir() { return this.#dir; }
    get area() { return this.#area; }
    get alias() { return this.#alias; }
    get fullPath() { return this.#fullPath; }
    get areaDir() { return this._owner.DIR[this.#area.toUpperCase()]; }
    get subDir() { return path.dirname(this.subPath); }
    get subPath() { return path.relative(this.dir + path.sep + this.areaDir, this.fullPath); }
    get localDir() { return this.areaDir + path.sep + this.subDir; }
    get localPath() { return this.areaDir + path.sep + this.subPath; }
    get name() { return path.basename(this.fullPath); }

    /**
     * 템플릿소스 생성자
     * @param {AutoTemplate} owner 소속된 템플릿
     * @param {*} area 구역코드
     * @param {*} alias 별칭
     * @param {*?} fullPath 전체경로(최상위부터)
     */
    constructor(owner, dir, area, alias, fullPath = null) {
        this._owner = owner;
        this.#dir = dir;
        this.#area = area;
        this.#alias = alias;
        this.isPublic = this._owner.defaultPublic;
        if (fullPath !== null) {
            this.#fullPath = fullPath;
        }
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
     * @overloading 상위 add(..) 호출함
     */
    add(alias, obj, fullPath = null, dir = this._owner.dir) {
        
        const localDir = this._owner.AREA[this.area];
        let tarSrc;

        // 유효성 검사
        if (typeof alias !== 'string' || alias.length === 0) {
            throw new Error('alias에 string 만 지정할 수 있습니다.');
        }
        if (typeof obj === 'undefined' || obj === null) {
            throw new Error('obj에 null 또는 undefined 지정할 수 없습니다. ');
        }
        if (this.area === 'data' && !(typeof obj === 'function' || typeof obj === 'object')) {
            throw new Error('area[data] 가능한 타입 : object(null 제외), function');
        }
        if (this.area === 'helper' && !(typeof obj === 'function')) {
            throw new Error('area[helper] 가능한 타입 : function');
        }

        // TODO: this.add('별칭', out.part['sss'] 삽입시)
        if (obj instanceof TemplateSource) {
            fullPath = obj.fullPath ?? dir + path.sep + localDir + path.sep + obj.subPath;
            tarSrc = new TemplateSource(this._owner, dir, this.area, alias, fullPath);
            tarSrc.content = obj.content;
        } else {
            tarSrc = new TemplateSource(this._owner, dir, this.area, alias, fullPath);
            tarSrc.content = obj;
        }

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
        const delmiter = this._owner.DELIMITER[this.area.toUpperCase()];
        const areaDir = this._owner.DIR[this.area.toUpperCase()];
        let arrPath = [];
        let localPattern, alias, content, subPath;

        for (let i = 0; i < dirs.length; i++) {
            localPattern = dirs[i] + sep + pattern;
            arrPath = glob.sync(localPattern);
            arrPath.forEach(val => { 
                subPath = path.relative(dirs[i] + sep + areaDir, val)
                alias = _this._makeAlias(subPath);
                content = require(val);
                _this.add(alias, content, val, dirs[i]);
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
        
        const delmiter = this._owner.DELIMITER[this.area.toUpperCase()];
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
                if (val instanceof TemplateSource) {
                    this._element[idx].content = val.content;
                } else {
                    throw new Error('TemplateSource 타입만 설정할 수 있습니다.');
                }
            },
            enumerable: true,
            configurable: true
        };
    }
}

exports.TemplateSource = TemplateSource;
exports.TemplateCollection = TemplateCollection;