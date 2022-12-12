const fs                                = require('fs');
const path                              = require('path');
const glob                              = require('glob');
const handlebars                        = require('handlebars');
const handlebarsWax                     = require('handlebars-wax');
const { PropertyCollection, Observer }  = require('entitybind');
const { TemplateSource }                = require('./source-template');

/**
 * 컴파일소스 클래스
 */
class CompileSource extends TemplateSource {
    
    /*_______________________________________*/        
    // public
    wax = null;
    
    /*_______________________________________*/        
    // private
    #part       = [];
    #helper     = [];
    #data       = [];
    #savePath   = '';
    #event      = new Observer(this, this);

    /*_______________________________________*/        
    // property
    get saveName() { return path.basename(this.savePath); }
    get saveDir() { return path.dirname(this.savePath); }
    get savePath() {
        const dir = this._owner.dir;    // 상속한 경우 최종 
        const fullPath = dir + path.sep + this.localPath;
        return this.#savePath === '' ? fullPath.replace('.hbs','') : this.#savePath;
    }
    set savePath(val) { this.#savePath = val; }
    
    /*_______________________________________*/        
    // event property
    set onCompile(fn) { this.#event.subscribe(fn, 'compile') }      // 컴파일 전
    set onCompiled(fn) { this.#event.subscribe(fn, 'compiled') }    // 컴파일 전

    /*_______________________________________*/
    // constructor method
    constructor(owner, area, alias, fullPath = null) {
        super(owner, area, alias, fullPath);
        this.wax = handlebarsWax(handlebars.create());
    }
    /*_______________________________________*/
    // public method
    partials(pattern, opt) {
        this.#part.push({glob: pattern, opt: opt});
    }

    helpers(pattern, opt) {
        this.#helper.push({glob: pattern, opt: opt});
    }

    data(pattern, opt) {
        this.#data.push({glob: pattern, opt: opt});
    }

    compile(data = {}, isSave = true) {

        
        let _this = this;
        let template, content;
        let outerScope = this._owner._getOuterScope();
        let localScope = this._owner._getLocalScope();
        
        // 이벤트 발생
        this._onCompile(this);
        
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

        // 이벤트 발생
        this._onCompiled(this);

        return content;
    }
    
    /*_______________________________________*/
    // event caller
    _onCompile(source) {
        this.#event.publish('compile', source);
    }
    _onCompiled(source) {
        this.#event.publish('compiled', source);
    }
}

/**
 * 컴파일컬렉션 클래스
 */
class CompileCollection extends PropertyCollection {
    
    area = null;
    _owner = null;

    /**
     * 컴파일컬렉션 생성자
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
     * @param {function | object | CompileSource} obj  대상
     * @param {*} fullPath glob를 통해서 입력한 경우만 
     * @overloading 상위 add(..) 호출함
     */
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
     * glob 패턴으로 복수의 경로의 파일을 컬렉션에 추가히기
     * @param {*} pattern js, hbs
     * @param {*} opt TODO:: glob 옵션으로 활용
     */
     addGlob(pattern, opt) {
        
        const _this = this;
        const sep = path.sep;
        const delmiter = this._owner.DELIMITER[this.area.toUpperCase()];
        let dirs = [];
        let arrPath = [];
        let areaDir = this._owner.PATH[this.area.toUpperCase()];
        let localPattern, alias, content, subPath, idx;

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

    /**
     * subPath를 입력받이서 별칭로 만들기
     * .hbs만 제거
     * @param {*} subPath 
     * @returns {string} 별칭
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