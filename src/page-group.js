const path                                      = require('path');
const { PropertyCollection, Observer }          = require('entitybind');
// import path from "path";
// import { PropertyCollection, Observer } from "entitybind";


class PageGroup {
    /*_______________________________________*/
    // public
    isPublic = true;
    alias = '';
    
    /*_______________________________________*/
    // protecrted
    _template = null;
    _pages = [];

    /*_______________________________________*/
    // private
    #argfix = [];   // 기본값 아규먼트
    #prefix = '';   // 기본값 접두사
    #suffix = '';   // 기본값 접미사

    /*_______________________________________*/        
    // property
    get argfix() { return this.#argfix };
    set argfix(val) {
        if (!Array.isArray(val)) throw new Error('argfix 가능한 타입 : array ');
        this.#argfix = val;
    }
    get prefix() { return this.#prefix };
    set prefix(val) {
        if (typeof val !== 'string') throw new Error('prefix 가능한 타입 : string ');   
        this.#prefix = val;
    }
    get suffix() { return this.#suffix };
    set suffix(val) {
        if (typeof val !== 'string') throw new Error('suffix 가능한 타입 : string ');   
        this.#suffix = val;
    }
    
    constructor(template, alias) {
        this._template = template;
        this.alias = alias;
    }

    /**
     * 페이지 개체를 설정한다.
     * @param {object | array} obj 배열 또는 객체
     */
    add(obj, defArgs) {
        let arr = [];
        let pageObj, src, alias, context;

        if (Array.isArray(obj)) arr = [...obj];
        else arr.push(obj);

        if (defArgs) this.argfix = defArgs;

        for (let i = 0; i < arr.length; i++) {
            
            pageObj = arr[i];
            alias = pageObj['page'];
            context = pageObj['context'] || '';
            src = this._template.page[alias] || null;

            if (src === null){
                throw new Error(`page에  ${alias} 존재하지 않습니다.`);
            }
    
            if (context === '' || typeof context !== 'string') {
                context = src.subPath;
            }
    
            this._pages.push({            
                page: alias,
                context: context,
                src: src
            });
        }
    }

    /**
     * 개별 페이지 삭제
     * @param {*} alias 
     * @returns 
     */
    remove(alias) {
        for (let i = 0; i < this._pages.length; i++) {
            if (this._pages[i].page === alias) return this._pages.splice(i, 1);
        }
    }

    /**
     * 모든 _page 삭제
     */
    clear() {
        this._pages = [];
    }

    // build(data, owner = this._owner) {
    build(data = {}) {
        // const owner = this._owner;
        const used = this._template.used;
        let page, src, context, subPath;
        let argfix, prefix, suffix, dir;

        if (typeof data !== 'object') throw new Error('[data] Object 타입만 설정할 수 있습니다.');

        prefix = data['prefix'] || this.prefix;
        suffix = data['suffix'] || this.suffix;
        argfix = data['args'] || this.argfix;
        dir = data['dir'] || '';
        // args = typeof data.args === 'string' ? data.args.split(',') : this.argfix;
        // args = args.map(val => val.trim()); // 문자열 공백 제거

        // TODO: 유효성 검사

        for (let i = 0; i < this._pages.length; i++) {
            page = this._pages[i];
            src = page.src;
            context = page.context || src.subPath;
            context = context.replace('.hbs','');
            context = dir.length > 0 ? path.join(dir, context) : context;
            // argfix = args.length > 0 ? args : this.#argfix;
            subPath = this._makePath(context, prefix, suffix, argfix);
            
            src.savePath = path.join(used.dir, used.DIR.PUB, subPath);  // 이름 재설정
            src._compile(data, true);
        }

    }
    
    _makePath(ctxPath, prefix = '', suffix = '', args = []) {
        
        let myPath, subDir, subPath, filename, arg;

        for (let i = 0; i < args.length; i++) {
            arg = args[i] || '';
            ctxPath = ctxPath.replaceAll(`{${i}}`, arg);
        }
        // prefix, suffix 적용
        myPath = path.parse(ctxPath);

        subDir = myPath.dir.length > 0 ? myPath.dir : '';
        filename = prefix + myPath.name + suffix + myPath.ext;
        subPath = subDir === '' ? filename : path.join(subDir, filename);
        return subPath;
    }
}

/**
 *  구룹컬렉션 클래스
 */
class PageGroupCollection extends PropertyCollection {
    
    /*_______________________________________*/        
    // protected
    _owner = null;
    _GROUP_REG  = [/^[\\\/]?all([\\\/]|$)/];
    _ALL        = 'all';

    /**
     * 네임스페이스컬렉션, import한 외부 Tempalate들
     * @param {AutoTemplate} owner 오토템플릿
     */
    constructor(owner) {
        super(owner);
        this._owner = owner;
        // all 기본 그룹 추가
        this.#setAllGroup();
    }

    /**
     * 페이지 그룹 추가
     * @param {string | PageGroup} alias name | PageGroup
     * @param {array<object> | PageGroup} pages config<obj> | PageGroup
     * @param {array<string>?} defaltFix 
     */
    add(obj, value, deffix = []) {

        let pg = null;
        let alias, pages = [];

        // 초기화 alias
        if (obj instanceof PageGroup) {
            alias = obj.alias;
            value = obj;
        } else {
            alias = obj;
            // pages = value;
        }
        // 
        if (value instanceof PageGroup) {
            // content = function(data, hb) {
            //     return value._compile(data, false);
            // }
            pg = value;
        } else {
            // pg = new PageGroup(this._owner, alias);
            pages = value;
        }


        // 유효성 검사
        if (typeof alias !== 'string' || alias.length === 0) {
            throw new Error('alias에 string 만 지정할 수 있습니다.');
        }
        if (!Array.isArray(pages)) {
            throw new Error('pages array<object> 만 지정할 수 있습니다.');
        }
        if (!Array.isArray(deffix)) {
            throw new Error('deffix 는 array<object> 만 지정할 수 있습니다.');
        }

        // 별칭 규칙 검사
        this._GROUP_REG.forEach(val => {
            if ((val instanceof RegExp && val.test(alias)) || 
                (typeof val === 'string' && val === alias)) {
                throw new Error(`[group]에 예약어를 입력할 수 없습니다. : ${val}`);
            }
        });

        if (!(pg instanceof PageGroup)){
            pg = new PageGroup(this._owner, alias);
            pg.add(pages, deffix);
        }
        // pg.argfix = deffix;
        // pg.fixs = ['aa', 'Aa'];
        // pg.prefix = 'aa';
        // pg.suffix = 'BB';

        super.add(alias, pg);
    }

    /**
     * 
     * @param {*} cSrc 
     * @override
     */
    remove(alias) {
        const pageGroup = this[alias];
        if (!(pageGroup instanceof PageGroup)) throw new Error(`${alias} pageGroup 존재하지 않습니다.`);
        if (alias === this._ALL) throw new Error(`${alias} 예약된 페이지그룹은 삭제 할 수 없습니다.`);
        else super.remove(this[alias]);
        
        // group['all'] 에서 제거 금지
        // if (this.area === 'PAGE') {
        //     const group = this._owner.group;
        //     group[this._ALL].remove(cSrc.alias);
        // }
    }

    /**
     * 컬렉션 모두 지우기 : all 은 제외
     * @override
     */
    clear() {
        // super.clear();
        
        for(let i = 0; i < this.count; i++) {
            const propName = this.propertyOf(i);
            if (propName !== this._ALL) this.removeAt(i);
        }
    }

    /**
     * 컬렉션 타입 추가하기
     * @param {*} collection 
     */
    addCollection(collection) {
        let alias;
        // 지우기
        // this.clear();
        
        if (!(collection instanceof PageGroupCollection)) throw new Error('PageGroupCollection 타입만 설정할 수 있습니다.');

        // 등록
        for (let i = 0; i < collection.count; i++) {
            alias = collection.propertyOf(i);
            if (alias !== this._ALL) {
                const pageGroup = this.#clonePage(collection[i]);
                super.add(alias, pageGroup);
            }
        }
    }

    /**
     * PageGroup의 page 를 복제하고, 소유자(_template)를 변경한다.
     * @param {*} pageGroup 
     */
    #clonePage(pageGroup) {
        if (!(pageGroup instanceof PageGroup)) throw new Error('PageGroup 타입만 설정할 수 있습니다.');
        const pages = pageGroup._pages;
        
        for (let i = 0; i < pages.length; i++) {
            const src = pages[i].src;
            const alias = pages[i].page;
            if (this._owner.page[alias]) {
                this._owner.page[alias] = src; // content 를 덮어씀
            } else {
                const clone = src.clone();
                this._owner.page.add(clone);
            }
            // 복제 페이지 갱싱
            pages[i].src = this._owner.page[alias];
        }
        pageGroup._template = this._owner;
        return pageGroup;
    }

    /**
     * group['all'] 추가
     */
    #setAllGroup() {
        super.add(this._ALL, new PageGroup(this._owner, this._ALL));
    }
}

exports.PageGroupCollection = PageGroupCollection;
exports.PageGroup = PageGroup;