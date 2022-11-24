const path = require('path');
const glob = require('glob');
const { PropertyCollection, Observer } = require('entitybind');

/**
 * 템플릿소스 클래스
 */
class TemplateSource {
    
    isPublic = true;    // export기 노출 여부
    
    constructor() {
        
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
    add()
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
                });
            }
        }

    }
}

exports.TemplateSource = TemplateSource;
exports.TemplateCollection = TemplateCollection;