const fs                    = require('fs');
const path                  = require('path');
const glob                  = require('glob');
const handlebars            = require('handlebars');
const handlebarsWax         = require('handlebars-wax');
// const { PropertyCollection, Observer } = require('entitybind');
const { TemplateSource, TemplateCollection } = require('./source-template');

/**
 * 컴파일소스 클래스
 */
class CompileSource extends TemplateSource {
    
    wax = null;
    
    /*_______________________________________*/        
    // private
    #part = [];
    #helper = [];
    #data = [];
    #savePath = null;

    /*_______________________________________*/        
    // property
    get saveName() {

    }
    get saveDir() {

    }
    get savePath() {
        return this.#savePath === null ? this.fullPath.replace('.hbs','') : this.#savePath;
    }
    set savePath(val) {
        this.#savePath = val;
    }

    constructor(owner, area, alias, fullPath = null) {
        super(owner, area, alias, fullPath);
        this.wax = handlebarsWax(handlebars.create());
    }
    /*_______________________________________*/
    // public method
    partials(obj, opt) {
        this.#part.push({glob: obj, opt: opt});
    }

    helpers(obj, opt) {
        this.#helper.push({glob: obj, opt: opt});
    }

    data(obj, opt) {
        this.#data.push({glob: obj, opt: opt});
    }

    compile(data) {

        let _this = this;
        let template;
        let outerScope = this._owner._getOuterScope();
        let localScope = this._owner._getLocalScope();
        let content;

        // 외부 스코프
        this.wax.partials(outerScope.part);
        this.wax.helpers(outerScope.helper);
        this.wax.data(outerScope.data);

        // 지역 스코프
        this.wax.partials(localScope.part);
        this.wax.helpers(localScope.helper);
        this.wax.data(localScope.data);

        // 내부 스코프
        this.#part.forEach(val => this.wax.partials(val.glob, val.opt));
        this.#helper.forEach(val => this.wax.helpers(val.glob, val.opt));
        this.#data.forEach(val => this.wax.data(val.glob, val.opt));

        template = this.wax.compile(this.content);

        // content = template(data);
        content = template({});
        
        // 파일저장
        fs.writeFileSync(this.savePath, content, 'utf8');

    }

    /*_______________________________________*/
    // protected method


}


/**
 * 컴파일컬렉션 클래스
 */
class CompileCollection extends TemplateCollection {
    
    
    constructor(owner, area) {
        super(owner, area);
    }

    /*_______________________________________*/
    // public method

    add(alias, obj, fullPath) {
        
        let tarSrc, dir, localDir;
        
        // alias 에 .이 있고
        if (typeof fullPath === 'undefined') {
            // fullPath = this._makeSubPath(alias);
            dir = this._owner.dir;
            localDir = this._owner.AREA[this.area];
            fullPath = dir + path.sep + localDir + path.sep + alias;
        }
        if (obj instanceof CompileSource) {
            tarSrc = obj;
        } else {
            tarSrc = new CompileSource(this._owner, this.area, alias, fullPath);
            tarSrc.content = obj;
        }

        super.add(alias, tarSrc);
    }

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
                // TODO:: 경로정보는 단축해야함
                subPath = path.relative(dirs[i] + sep + areaDir, val)
                alias = _this._makeAlias(subPath);
                content = fs.readFileSync(val,'utf-8');
                _this.add(alias, content, val);
            });
        }
    }

    /*_______________________________________*/
    // protected method
    _add(fullPath, area) {
        let obj  = new CompileSource(this._owner, fullPath, area);
        let alias = obj.alias;

        super.add(alias, obj);
    }

    /**
     * .hbs만 제거
     * @param {*} subPath 
     */
    _makeAlias(subPath) {

        let fileName, delmiter, dir;
        
        delmiter = this._owner.DELIMITER[this.area.toUpperCase()];
        fileName = path.basename(subPath, this._owner.TEMP_EXT);    // .hbs 제거
        dir = path.parse(subPath).dir;
        dir = dir.replace(/\//g, delmiter);                   // 구분 문자 변경
        dir = dir.length > 0 ? dir + delmiter : dir;
        return dir + fileName;
    }
}


exports.CompileSource = CompileSource;
exports.CompileCollection = CompileCollection;