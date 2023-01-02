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
    set onSave(fn) { this.#event.subscribe(fn, 'save') }    // 컴파일 전

    /*_______________________________________*/
    // constructor method
    constructor(owner, dir, area, alias, fullPath = null) {
        super(owner, dir, area, alias, fullPath);
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

        // 이벤트 발생
        this._onCompile(this);
        
        // 외부 스코프
        this.wax.partials(this._owner._outerScope.part);
        this.wax.helpers(this._owner._outerScope.helper);
        this.wax.data(this._owner._outerScope.data);

        // 지역 스코프
        this.wax.partials(this._owner._localScope.part);
        this.wax.helpers(this._owner._localScope.helper);
        this.wax.data(this._owner._localScope.data);

        // 내부 스코프
        this.#part.forEach(val => this.wax.partials(val.glob, val.opt));
        this.#helper.forEach(val => this.wax.helpers(val.glob, val.opt));
        this.#data.forEach(val => this.wax.data(val.glob, val.opt));

        // 템플릿 컴파일
        template = this.wax.compile(this.content);
        content = template(data);
        
        // 파일저장
        if (isSave === true) {
            fs.writeFileSync(this.savePath, content, 'utf8');

            // 빌드 파일 추가
            this._owner._addBuildFile(this.savePath, 'publish')

            // 이벤트 발생
            this._onSave(this, this.savePath);
        }

        // 이벤트 발생
        this._onCompiled(this);

        return content;
    }

    build(data) {
        // 컴파일
        this.compile(data, true);
        // 빌드 파일 저장
        this._owner._saveBuildFile();
    }
    
    /*_______________________________________*/
    // event caller
    _onCompile(source) {
        this.#event.publish('compile', source);
    }
    _onCompiled(source) {
        this.#event.publish('compiled', source);
    }
    _onSave(source) {
        this.#event.publish('save', source);
    }
}

/**
 * 컴파일컬렉션 클래스
 */
class CompileCollection extends PropertyCollection {
    
    area = null;
    
    /*_______________________________________*/        
    // protected
    _owner = null;
    // ns, page, group 시작 예약어
    _partSymbol = [/^[\\\/]?ns([\\\/]|$)/, /^[\\\/]?page([\\\/]|$)/, /^[\\\/]?group([\\\/]|$)/];

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
     * @param {function | object | CompileSource | string} obj  대상
     * @param {*} fullPath glob를 통해서 입력한 경우만 
     * @overloading 상위 add(..) 호출함
     */
    add(alias, obj, fullPath = null, dir = this._owner.dir) {
        
        const delimiter = this._owner.DELIMITER[this.area.toUpperCase()];
        const sep = path.sep;
        const areaDir = this._owner.PATH[this.area.toUpperCase()];
        let tarSrc;
        
        // 유효성 검사
        if (typeof alias !== 'string' || alias.length === 0) {
            throw new Error('alias에 string 만 지정할 수 있습니다.');
        }
        if (typeof obj === 'undefined' || obj === null) {
            throw new Error('obj에 null 또는 undefined 지정할 수 없습니다. ');
        }
        if (this.area === 'part' && !(typeof obj === 'function' || typeof obj === 'string')) {
            throw new Error('area[part] 가능한 타입 : string, function');
        }
        if (this.area === 'src' && !(typeof obj === 'function' || typeof obj === 'string')) {
            throw new Error('area[src] 가능한 타입 : string, function');
        }

        // 별칭 규칙 검사
        if (this.area === 'part') {
            this._partSymbol.forEach(val => {
                if ((val instanceof RegExp && val.test(alias)) || 
                    (typeof val === 'string' && val === alias)) {
                    throw new Error('[part]에 예약어를 입력할 수 없습니다. : ns, page, group ');
                }
            });
        }
        
        // 생성
        if (obj instanceof CompileSource) {
            fullPath = obj.fullPath ?? dir + sep + areaDir + sep + obj.subPath;
            tarSrc = new TemplateSource(this._owner, dir, this.area, alias, fullPath);
            tarSrc.content = obj.content;
            tarSrc = obj;
        } else {
            fullPath = fullPath ?? dir + sep + areaDir + sep + alias.replaceAll(delimiter, sep);
            tarSrc = new CompileSource(this._owner, dir, this.area, alias, fullPath);
            tarSrc.content = obj;
        }

        // 추가
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
     * @param {*} pattern js, hbs
     * @param {*} opt TODO:: glob 옵션으로 활용
     */
     addGlob(pattern, opt) {
        
        const _this = this;
        const sep = path.sep;
        const delimiter = this._owner.DELIMITER[this.area.toUpperCase()];
        const areaDir = this._owner.PATH[this.area.toUpperCase()];
        let dirs = [];
        let arrPath = [];
        let localPattern, alias, content, subPath, idx;

        // src 의 경우 단일 경로 에서 로딩
        if (this.area === this._owner.AREA.SRC) dirs.push(this._onwer.dir);
        else dirs = [...dirs, ...this._onwer.dirs];

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
                    _this[idx] = new CompileSource(_this._owner, dirs[i], this.area, alias, val);
                    _this[idx].content = content;
                } else {
                    _this.add(alias, content, val, dirs[i]);
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

        let fileName, delimiter, dir;
        
        delimiter = this._owner.DELIMITER[this.area.toUpperCase()];
        fileName = path.basename(subPath, this._owner.TEMP_EXT);    // .hbs 제거
        dir = path.parse(subPath).dir;
        dir = dir.replace(/\//g, delimiter);                   // 구분 문자 변경
        dir = dir.length > 0 ? dir + delimiter : dir;
        return dir + fileName;
    }

    /**
     * setter 에서 CompileSource 타입만 받음
     * setter 타입에 따라서 등록위치가 달라짐
     * @param {*} idx 
     * @returns
     * @override 
     */
    _getPropDescriptor(idx) {
        return {
            get: function() { return this._element[idx]; },
            set: function(val) {
                if (val instanceof CompileSource) {
                    this._element[idx].content = val.content;
                } else {
                    throw new Error('CompileSource 타입만 설정할 수 있습니다.');
                }
            },
            enumerable: true,
            configurable: true
        };
    }
}

exports.CompileSource = CompileSource;
exports.CompileCollection = CompileCollection;