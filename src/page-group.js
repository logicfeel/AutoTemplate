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
    #argfix = [];
    #prefix = '';
    #suffix = '';

    /*_______________________________________*/        
    // property
    get argfix() { return this.#argfix };
    set argfix(val) {
        if (!Array.isArray(val)) throw new Error('argfix 가능한 타입 : array ');
        this.#argfix = val;
    }
    get prefix() { return this.#prefix };
    set prefix(val) {
        if (typeof val !== 'string') throw new Error('prefix 가능한 타입 : string ');   // COVER:
        this.#prefix = val; // COVER:
    }
    get suffix() { return this.#suffix };
    set suffix(val) {
        if (typeof val !== 'string') throw new Error('suffix 가능한 타입 : string ');   // COVER:
        this.#suffix = val; // COVER:
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
                throw new Error(`page에  ${alias} 존재하지 않습니다.`); // COVER:
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

    // build(data, owner = this._owner) {
    build(data) {
        
        // const owner = this._owner;
        const used = this._template.used;
        let page, src, context, subPath;
        let argfix, prefix, suffix, dir;

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

            // }
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
    
    // #linkSource() {
        
    //     let src = null;

    //     for (let i = 0; i < this._pages.length; i++) {
    //         src = this._auto.page[this._pages[i]] || null;
    //         if (src === null){
    //             throw new Error(`page에  ${alias} 존재하지 않습니다. build 시점에 로딩이 필요한 경우 생성자 (,,true) 설정하세요.`);
    //         }
    //         this._pages[i]['src'] = src;
    //     }
    // }


}

/**
 *  구룹컬렉션 클래스
 */
class PageGroupCollection extends PropertyCollection {
    


    /*_______________________________________*/        
    // protected
    _owner = null;
    // all 예약어
    _groupSymbol = [/^[\\\/]?all([\\\/]|$)/];

    /**
     * 네임스페이스컬렉션, import한 외부 Tempalate들
     * @param {AutoTemplate} owner 오토템플릿
     */
    constructor(owner) {
        super(owner);
        this._owner = owner;
    }

    // * this.group.add('spring', [ 
    // *  {page: 'aaa.c', page: '{0}inc/fileA{1}'},   // A 그룹설정
    // *  {page: 'bbb.c', page: '{0}inc/fileB{1}'},   // B 그룹설정
    // * ],
    // * ['A','B']);  // 접두접미사의 기본값

    /**
     * 페이지 그룹 추가
     * @param {string | PageGroup} alias name | PageGroup
     * @param {array<object> | PageGroup} pages config<obj> | PageGroup
     * @param {array<string>?} defaltFix 
     */
    // add(alias, pages, deffix) {

    //     let pg = null;

    //     // 유효성 검사
    //     if (typeof alias !== 'string' || alias.length === 0) {
    //         throw new Error('alias에 string 만 지정할 수 있습니다.');
    //     }
    //     if (!Array.isArray(pages)) {
    //         throw new Error('pages array<object> 만 지정할 수 있습니다.');
    //     }
    //     if (!Array.isArray(deffix)) {
    //         throw new Error('alias에 array<object> 만 지정할 수 있습니다.');
    //     }

    //     // 별칭 규칙 검사
    //     this._groupSymbol.forEach(val => {
    //         if ((val instanceof RegExp && val.test(alias)) || 
    //             (typeof val === 'string' && val === alias)) {
    //             throw new Error('[group]에 예약어를 입력할 수 없습니다. : all');
    //         }
    //     });

    //     pg = new PageGroup(this._owner, alias);
    //     pg.add(pages, deffix);
    //     // pg.argfix = deffix;
    //     // pg.fixs = ['aa', 'Aa'];
    //     // pg.prefix = 'aa';
    //     // pg.suffix = 'BB';

    //     super.add(alias, pg);
    // }
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
            throw new Error('alias에 string 만 지정할 수 있습니다.');       // COVER:
        }
        if (!Array.isArray(pages)) {
            throw new Error('pages array<object> 만 지정할 수 있습니다.');  // COVER:
        }
        if (!Array.isArray(deffix)) {
            throw new Error('deffix 는 array<object> 만 지정할 수 있습니다.');      // COVER:
        }

        // 별칭 규칙 검사
        this._groupSymbol.forEach(val => {
            if ((val instanceof RegExp && val.test(alias)) || 
                (typeof val === 'string' && val === alias)) {
                throw new Error('[group]에 예약어를 입력할 수 없습니다. : all');    // COVER:
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
     * group.all 컬렉션 설정 setPropDefault
     * 
     */
    _setDefaultProp() {

        // const pg = new PageGroup(this._owner, 'all', pages, defaltFix);
        const pg = new PageGroup(this._owner, 'all');
        let alias;

        for (let i = 0; i < this._owner.page.count; i++) {
            alias = this._owner.page.propertyOf(i);
            pg.add({ 
                page: alias,
                context: this._owner.page.subPath
            });
        }
        super.add(pg.alias, pg);
    }
}

exports.PageGroupCollection = PageGroupCollection;
exports.PageGroup = PageGroup;
// export { PageGroupCollection, PageGroup }