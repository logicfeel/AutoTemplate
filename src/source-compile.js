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
        const dir = this._owner.dir;    // 상속한 경우 최종 
        const sfullPath = this.fullPath;


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

    compile(data = {}, isSave = true) {

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

        // 템플릿 컴파일
        template = this.wax.compile(this.content);
        content = template(data);
        
        // 파일저장
        if (isSave === true) fs.writeFileSync(this.savePath, content, 'utf8');

        return content;
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
        const delmiter = this._owner.DELIMITER[this.area.toUpperCase()];
        let dirs = [];
        let arrPath = [];
        let localPattern, alias;
        let content;
        let areaDir = this._owner.PATH[this.area.toUpperCase()];
        let subPath;
        let idx;

        // src 의 경우 단일 경로 에서 로딩
        if (this.area === this._owner.AREA.SRC) dirs.push(this._onwer.dir);
        else dirs = dirs.concat(this._onwer.dirs);

        for (let i = 0; i < dirs.length; i++) {
            localPattern = dirs[i] + sep + pattern;
            arrPath = glob.sync(localPattern);
            arrPath.forEach(val => { 
                subPath = path.relative(dirs[i] + sep + areaDir, val)
                alias = _this._makeAlias(subPath);
                content = fs.readFileSync(val,'utf-8');
                
                idx = _this.indexOfName(alias);  // 중복이름 검사
                // 중복 검사
                if (idx > -1) {
                    _this[idx] = new CompileSource(_this._owner, this.area, alias, val);
                    _this[idx].content = content;
                } else {
                    _this.add(alias, content, val);
                }
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