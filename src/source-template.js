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
    #name = '';

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
        return this.#name;
    }


    constructor(owner, fullPath, area) {
        
        let fileName = '';
        let delmiter;
        
        this._owner = owner;
        this.#fullPath = fullPath;
        this.#area = area;
        this.isPublic = this._owner.defaultPublic;
        fileName = path.basename(fullPath, owner.TEMP_EXT);
        if (area === this._owner.AREA.DATA || area === this._owner.AREA.HELPER) {
            delmiter = this._owner.DELIMITER[area]
            fileName =  path.parse(fileName).name;          // 확장자 제거
            this.#name = fileName.replace(/\./, delmiter);  // 점(.) 구분자 변경
        } else {
            this.#name = fileName;
        }
        this.#alias = this.#makeAlias();
    }

    /*_______________________________________*/        
    // private method
    #makeAlias() {
        
        let alias;
        let delmiter = this._owner.DELIMITER[this.area];

        alias = this.subDir.replace(/\//g, delmiter);    // 구분 문자 변경
        return alias + delmiter + this.name;
    }
}

/**
 * 템플릿컬렉션 클래스
 */
class TemplateCollection extends PropertyCollection {
    
    _owner = null;
    
    constructor(owner) {
        super(owner);
        this._owner = owner;
    }
    /*_______________________________________*/
    // public method
    _add(fullPath, area) {
        let obj  = new TemplateSource(this._owner, fullPath, area);
        let alias = obj.alias;

        super.add(alias, obj);
    }

    addPath(area) {

        const _this = this;
        const sep = path.sep;
        const dirs = this._onwer.dirs;
        const delmiter = this._owner.DELIMITER[area];
        let dir = '', bDir = '';
        let arrPath = [];
        let globPattern;

        for (let i = 0; i < dirs.length; i++) {
            dir = dirs[i] + sep + location;
            bDir = dirs[i];
            globPattern = this.GLOB[area];
            if (fs.existsSync(dir) && globPattern) {
                arrPath = glob.sync(dir + sep + globPattern);
                // _addPaths(dir, '', bDir);
                arrPath.forEach(val => {
                    // _this.add(val);
                    // STOP
                    _this._add(val, area);
                });
            }
        }

    }
}

exports.TemplateSource = TemplateSource;
exports.TemplateCollection = TemplateCollection;