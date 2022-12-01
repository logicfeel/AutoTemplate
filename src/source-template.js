const path = require('path');
const glob = require('glob');
const { PropertyCollection, Observer } = require('entitybind');

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
    // #name = '';

    /*_______________________________________*/        
    // property
    get fullPath() {
        return this.#fullPath;
    }
    get alias() {
        return this.#alias;
    }
    get subDir() {
        return path.dirname(this.subPath);
    }
    get subPath() {
        const dir = this._owner.dir;
        return path.relative(dir + path.sep + this.area, this.fullPath); 
    }
    get name() {
        return path.basename(this.fullPath);
        // return this.#name;
    }


    constructor(owner, area, alias, fullPath = null) {
        
        let fileName = '';
        let delmiter;
        
        this._owner = owner;
        this.#area = area;
        this.#alias = alias;
        this.isPublic = this._owner.defaultPublic;
        if (fullPath !== null) {
            this.#fullPath = fullPath;

        }
        // fileName = path.basename(fullPath, owner.TEMP_EXT);
        // if (area === this._owner.AREA.DATA || area === this._owner.AREA.HELPER) {
        //     delmiter = this._owner.DELIMITER[area]
        //     fileName =  path.parse(fileName).name;          // 확장자 제거
        //     this.#name = fileName.replace(/\./, delmiter);  // 점(.) 구분자 변경
        // } else {
        //     this.#name = fileName;
        // }
        // this.#alias = this.#makeAlias();
    }

    /*_______________________________________*/        
    // private method
    // #makeAlias() {
        
    //     let alias;
    //     let delmiter = this._owner.DELIMITER[this.area];

    //     alias = this.subDir.replace(/\//g, delmiter);    // 구분 문자 변경
    //     return alias + delmiter + this.name;
    // }
}

/**
 * 템플릿컬렉션 클래스
 */
class TemplateCollection extends PropertyCollection {
    
    _owner = null;
    area = null;

    constructor(owner, area) {
        super(owner);
        this._owner = owner;
        this.area = area;
    }
    /*_______________________________________*/
    // public method
    /**
     * 
     * @param {*} alias 
     * @param {function | object | TemplateSource} obj  
     * @param {*} fullPath glob를 통해서 입력한 경우만 
     */
    add(alias, obj, fullPath) {
        
        let tarSrc;
        
        // alias 에 .이 있고
        // if (typeof fullPath === 'undefined') {
        //     fullPath = this._makeSubPath(alias);
        // }
        if (obj instanceof TemplateSource) {
            tarSrc = obj;
        } else {
            tarSrc = new TemplateSource(this._owner, this.area, alias, fullPath);
            tarSrc.content = obj;
        }

        super.add(alias, tarSrc);
    }

    // addPath(area) {

    //     const _this = this;
    //     const sep = path.sep;
    //     const dirs = this._onwer.dirs;
    //     const delmiter = this._owner.DELIMITER[area];
    //     let dir = '', bDir = '';
    //     let arrPath = [];
    //     let globPattern;

    //     for (let i = 0; i < dirs.length; i++) {
    //         dir = dirs[i] + sep + location;
    //         bDir = dirs[i];
    //         globPattern = this.GLOB[area];
    //         if (fs.existsSync(dir) && globPattern) {
    //             arrPath = glob.sync(dir + sep + globPattern);
    //             // _addPaths(dir, '', bDir);
    //             arrPath.forEach(val => {
    //                 // _this.add(val);
    //                 // STOP
    //                 _this._add(val, area);
    //             });
    //         }
    //     }
    // }

    /**
     * 
     * @param {*} pattern js, json
     */
    addGlob(pattern, opt) {
        
        const _this = this;
        const sep = path.sep;
        const dirs = this._onwer.dirs;
        const delmiter = this._owner.DELIMITER[this.area.toUpperCase()];
        let arrPath = [];
        let localPattern, alias;
        let content;
        let areaDir = this._owner.PATH[this.area.toUpperCase()];
        let subPath;

        for (let i = 0; i < dirs.length; i++) {
            localPattern = dirs[i] + sep + pattern;
            arrPath = glob.sync(localPattern);
            arrPath.forEach(val => { 
                subPath = path.relative(dirs[i] + sep + areaDir, val)
                alias = _this._makeAlias(subPath);
                content = require(val);
                _this.add(alias, content, val);
            });
        }
    }

    /*_______________________________________*/
    // protected method
    // _add(fullPath, area) {
    //     let obj  = new TemplateSource(this._owner, fullPath, area);
    //     let alias = obj.alias;

    //     super.add(alias, obj);
    // }

    /**
     * 
     * @param {*} subPath .hbs는 제거후 
     * @returns 
     */
    _makeAlias(subPath) {
        
        let fileName, delmiter, dir;
        
        delmiter = this._owner.DELIMITER[this.area.toUpperCase()];
        fileName = path.parse(subPath).name;
        dir = path.parse(subPath).dir;
        dir = dir.replace(/\//g, delmiter);       // 구분 문자 변경
        dir = dir.length > 0 ? dir + delmiter : dir;
        return dir + fileName;
    }

    /**
     * alias 입력하면 여기에 맞는 경로로 변환
     * @param {*} alias 
     */
    //  _makeSubPath(alias) {

    //     let subPath, fileName, delmiter;
        
    //     delmiter = this._owner.DELIMITER[this.area];
    //     subPath = alias.replace(/\//g, delmiter);       // 구분 문자 변경
    //     fileName = path.parse(subPath).name;            // 확장자 제거
    //     return alias + delmiter + fileName;
    // }
}

exports.TemplateSource = TemplateSource;
exports.TemplateCollection = TemplateCollection;