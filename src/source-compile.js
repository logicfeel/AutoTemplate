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
    
    /*_______________________________________*/        
    // protected
    _wax = null;

    /*_______________________________________*/        
    // private
    #part       = [];
    #helper     = [];
    #data       = [];
    #savePath   = null;
    #origin     = null;
    #event      = new Observer(this, this);

    /*_______________________________________*/        
    // property
    get saveName() { return path.basename(this.savePath); }
    get saveDir() { return path.dirname(this.savePath); }
    get savePath() {
        const dir = this._template.dir;    // 상속한 경우 최종 
        const fullPath = path.join(dir, this.localPath);
        return this.#savePath === null ? fullPath : this.#savePath;
    }
    set savePath(val) { this.#savePath = val; }
    get origin() {
        // return this.#origin === null;
        return this.#origin === null ? this.subPath : this.#origin;
    }
    set origin(val) { this.#origin = val; }
    
    /*_______________________________________*/        
    // event property
    set onCompile(fn) { this.#event.subscribe(fn, 'compile') }      // 컴파일 전
    set onSave(fn) { this.#event.subscribe(fn, 'save') }            // 저장시 저장후
    set onCompiled(fn) { this.#event.subscribe(fn, 'compiled') }    // 컴파일 전

    /*_______________________________________*/
    // constructor method
    constructor(template, dir, area, alias, filePath = null) {
        super(template, dir, area, alias, filePath);
        this._wax = handlebarsWax(handlebars.create());
    }
    /*_______________________________________*/
    // public method
    getObject() {
        let obj1 = super.getObject();
        let obj2 = {
            saveName: this.saveName,
            saveDir: this.saveDir,
            savePath: this.savePath,
            origin: this.origin,
        };
        return { ...obj1, ...obj2 };
    }

    clone(isEvent = false) {    // REVIEW: 이벤트 복사가 필요한지?
        const parent = super.clone();
        const clone = new CompileSource(parent._template, parent.dir, parent.area, parent.alias, parent.filePath);

        if (this.origin) clone.origin       = this.#origin;
        if (this.savePath) clone.savePath   = this.#savePath;
        if (this.content) clone['content']  = this.content;

        // clone.savePath  = this.#savePath;
        // if (isEvent === true) this.#event; 
        return clone;
    }

    partials(pattern, opt) {
        this.#part.push({glob: pattern, opt: opt});
    }

    helpers(pattern, opt) {
        this.#helper.push({glob: pattern, opt: opt});
    }
    
    data(pattern, opt) {
        this.#data.push({glob: pattern, opt: opt});
    }
    
    /**
     * 단독으로 컴파일할 경우 (빌드 로그 생성)
     * @param {*} data 
     */
    build(data) {
        // 컴파일
        this._compile(data, true);
        // 빌드 파일 저장
        this._template.used._saveBuildFile();
    }

    /**
     * 템플릿 컴파일
     * @param {*} data 데이터
     * @param {*} isSave 저장유무
     * @returns 
     */
    _compile(data = {}, isSave = true) {
        const localScope = this._template.localScope;
        const outerScope = this._template.outerScope;
        const used = this._template.used;
        const isKeepEdit = this._template.isKeepEdit;
        const _this = this;
        let template, content, dirname, originPath, oriData;

        // 이벤트 발생
        this._onCompile(this);
        
        // 외부 스코프
        this._wax.partials(outerScope.part);
        this._wax.helpers(outerScope.helper);
        this._wax.data(outerScope.data);

        // 지역 스코프
        this._wax.partials(localScope.part);
        this._wax.helpers(localScope.helper);
        this._wax.data(localScope.data);

        // 내부 스코프
        this.#part.forEach(val => this._wax.partials(val.glob, val.opt));
        this.#helper.forEach(val => this._wax.helpers(val.glob, val.opt));
        this.#data.forEach(val => this._wax.data(val.glob, val.opt));
        
// console.log(this.alias);
        // 템플릿 컴파일
        template = this._wax.compile(this.content);
        content = template(data);

// console.log(content);

        // 파일저장
        if (isSave === true) {
            dirname = path.dirname(this.savePath);
            if(!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, {recursive: true} );  // 디렉토리 만들기
            }
            // 원본 저장
            originPath = this._setOrigin(this.origin, content);
            
            // 편집 유지일 경우
            if (isKeepEdit) {
                // 파일의 유무 확인
                if (!fs.existsSync(this.savePath) || content === fs.readFileSync(this.savePath,'utf-8')) {
                    fs.writeFileSync(this.savePath, content, 'utf8');
                }
                //     if(fs.existsSync(originPath)) oriData = fs.readFileSync(originPath,'utf-8');
                // if (oriData !== content && fs.existsSync(this.savePath)) {
                //     fs.writeFileSync(this.savePath, content, 'utf8');
                // }
            } else {
                // 저장
                fs.writeFileSync(this.savePath, content, 'utf8');   // COVER:
            }

            // 빌드 파일 추가
            used._addBuildFile({tar: this.savePath, ori: originPath}, 'publish');

            // 이벤트 발생
            this._onSave(this, this.savePath);
        }

        // 이벤트 발생
        this._onCompiled(this);

        return content;
    }

    /**
     * 원본 경로 설정
     * @param {*} oriPath 
     * @param {*} data 
     * @returns 
     */
    _setOrigin(oriPath, data) {
        const orginDir = this._template.used.DIR['ORIGIN'];
        let focusPath = this._template._buildFile['focus'][oriPath] 
                ? this._template._buildFile['focus'][oriPath] 
                : path.join(this._template.used.dir, orginDir, oriPath);
        // let savePath;

        function saveFile(savePath, data) {
            const saveDir = path.dirname(savePath);  
            if(!fs.existsSync(saveDir)) {
                fs.mkdirSync(saveDir, {recursive: true} );
            }
            fs.writeFileSync(savePath, data, 'utf8');
        }
        function getNewPath(focusPath) {
            const MAX_COUNT = 10; // 최대 수정 갯수
            const objPath = path.parse(focusPath);
            let newPath;
            for (let i = 0; i < MAX_COUNT; i++) {
                const filename = '$'+ objPath.name;
                newPath = path.join(objPath.dir, filename + objPath.ext);
                if (!fs.existsSync(newPath)) return newPath;
            }
            throw new Error(`수정 최대 갯수 ${MAX_COUNT}개 초과`);  // COVER:
        }

         // 파일이 없으면 저장
        if (!fs.existsSync(focusPath)) {   
            saveFile(focusPath, data);
        } else {
            // 파일 비교
            if (data !== fs.readFileSync(focusPath,'utf-8')) {
                focusPath = getNewPath(focusPath);
                // this._template._buildFile['focus'][oriPath] = focusPath;
                saveFile(focusPath, data);
            }
        }
        return focusPath;
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
     * @param {string | TemplateSource} obj 별칭, 템플릿소스
     * @param {function | object | string | CompileSource} value  대상
     * dss
     * @param {*} filePath glob를 통해서 입력한 경우만 
     * @override 상위 add(..) 호출함
     */
    add(obj, value, filePath = null, dir = this._owner.dir) {
        const delimiter = this._owner.DELIMITER.PART;
        const sep = path.sep;
        // const areaDir = this._owner.DIR[this.area.toUpperCase()];
        const areaDir = this._owner.DIR[this.area];
        let tarSrc, content;
        let alias;
    
        // 초기값 설정
        if (obj instanceof TemplateSource) {
            alias = obj.alias;
            value = obj;
        } else alias = obj;

        // content = obj instanceof TemplateSource ? obj.content : obj;

        // if (value instanceof TemplateSource) {
        //     content = function(data, hb) {
        //         return value._compile(data, false);
        //     }
        // } else content = value;
        if (value instanceof TemplateSource) {
            if (value.dir !== this._owner.dir) {
                content = function(data, hb) {
                    return value._compile(data, false);
                }
            } else content = value.content;
        } else content = value;
        
        // 유효성 검사
        if (typeof alias !== 'string' || alias.length === 0) {
            throw new Error('alias에 string 만 지정할 수 있습니다.');
        }
        if (typeof content === 'undefined' || content === null) {
            throw new Error('value에 null 또는 undefined 지정할 수 없습니다. ');
        }
        // area별 타입 검사
        if (!(typeof content === 'function' || typeof content === 'string')) {
            throw new Error('가능한 타입 : string, function');
        }

        // 별칭 규칙 검사
        if (this.area === 'PART') {
            this._partSymbol.forEach(val => {
                if ((val instanceof RegExp && val.test(alias)) || 
                    (typeof val === 'string' && val === alias)) {
                    throw new Error('[part]에 예약어를 입력할 수 없습니다. : ns, page, group ');    // COVER:
                }
            });
        }
        
        // 생성
        // if (obj instanceof CompileSource) {
        //     fullPath = obj.fullPath ?? dir + sep + areaDir + sep + obj.subPath;
        // } else {
        //     fullPath = fullPath ?? dir + sep + areaDir + sep + alias.replaceAll(delimiter, sep);
        // }

        tarSrc = new CompileSource(this._owner, dir, this.area, alias, filePath);
        
        if (value instanceof CompileSource) tarSrc.origin = value.origin;   // 원본경로 설정


        // if (obj instanceof TemplateSource && obj._template !== this._template) {
        //     tarSrc.content = function(data, hb) {
        //         return obj._compile(data, false);
        //     }
        // } else {
        //     tarSrc.content = content;
        // }
        tarSrc.content = content;

        /**
         * 우선순위 : CompileSource > CompileSource > native(fun, str, bool, num..)
         * REVIEW:
         */
        // if (ob instanceof CompileSource) {
        // } else if (obj instanceof TemplateSource) {
        // } else {
        // }
        
        // 추가
        super.add(alias, tarSrc);

        if (this.area === 'PAGE') {
            this._addAllGroup(alias, tarSrc);
        }
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
        // const sep = path.sep;
        // const delimiter = this._owner.DELIMITER[this.area.toUpperCase()];
        // const delimiter = this._owner.DELIMITER.PART;
        // const areaDir = this._owner.DIR[this.area.toUpperCase()];
        const areaDir = this._owner.DIR[this.area];
        let dirs = [];
        let arrPath = [];
        let localPattern, alias, content, subPath, idx;

        // src 의 경우 단일 경로 에서 로딩
        if (this.area === this._owner.AREA.SRC) dirs.push(this._onwer.dir);
        else dirs = [...dirs, ...this._onwer.dirs];

        for (let i = 0; i < dirs.length; i++) {
            localPattern = path.join(dirs[i], pattern);
            arrPath = glob.sync(localPattern);
            arrPath.forEach(val => {
                subPath = path.relative(path.join(dirs[i], areaDir), val)
                alias = _this._makeAlias(subPath);
                content = fs.readFileSync(val,'utf-8');
                
                idx = _this.indexOfName(alias);  // 중복이름 검사
                
                if (idx > -1) { // 컬렉션이 존재할 경우
                    // _this[idx] = new CompileSource(_this._owner, dirs[i], this.area, alias, val);
                    // _this[idx].content = content;
                    _this._setElement(idx, new CompileSource(_this._owner, dirs[i], this.area, alias, val));
                    _this[idx].content = content;
                } else {
                    _this.add(alias, content, val, dirs[i]);
                }
            });
        }
    }

    /**
     * 
     * @param {*} cSrc 
     * @override
     */
    // remove(cSrc) {  
    //     super.remove(cSrc);
    //     // page['all'] 에서 제거
    //     if (this.area === 'PAGE') {
    //         const group = this._owner.group;
    //         group['all'].remove(cSrc.alias);
    //     }
    // }
    remove(alias) {
        const compileSource = this[alias];

        if (!(compileSource instanceof CompileSource)) throw new Error(`${alias} CompileSource 존재하지 않습니다.`);
        
        super.remove(compileSource);
        
        if (this.area === 'PAGE') {
            const group = this._owner.group;
            group['all'].remove(compileSource.alias);
        }
    }

    /**
     * 컬렉션 모두 지우기
     * @override
     */
    clear() {
        super.clear();
        // page['all'] 에서 제거
        if (this.area === 'PAGE') {
            const group = this._owner.group;
            group['all'].clear();
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
        
        // delimiter = this._owner.DELIMITER[this.area.toUpperCase()];
        delimiter = this._owner.DELIMITER.PART;
        fileName = path.basename(subPath, this._owner.TEMP_EXT);    // .hbs 제거
        dir = path.parse(subPath).dir;
        dir = dir.replace(/\//g, delimiter);                   // 구분 문자 변경
        dir = dir.length > 0 ? dir + delimiter : dir;
        return dir + fileName;
    }

    _addAllGroup(alias, cSrc) {
        const group = this._owner.group;

        group['all'].add({ page: alias, context: cSrc.subPath });
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
                let content;
                
                if (val instanceof CompileSource) content = val.content;
                else content = val;

                if (!(typeof content === 'function' || typeof content === 'string')) {
                    throw new Error('가능한 타입 : string, function');
                }
                this._element[idx].content = content;
                
                // if (val instanceof CompileSource) {
                //     this._element[idx].content = val.content;
                // } else {
                //     throw new Error('CompileSource 타입만 설정할 수 있습니다.');
                // }
            },
            enumerable: true,
            configurable: true
        };
    }

    _setElement(idx, elem) {
        this._element[idx] = elem;
    }
}

exports.CompileSource = CompileSource;
exports.CompileCollection = CompileCollection;