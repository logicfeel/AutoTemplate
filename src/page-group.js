const path                                      = require('path');
const { PropertyCollection, Observer }          = require('entitybind');

/**
 *  구룹컬렉션 클래스
 */
class GroupCollection extends PropertyCollection {
    


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
     * @param {string} alias 
     * @param {array<object>} pages 
     * @param {array<string>} defaltFix 
     */
    add(alias, pages, defaultFix) {

        let pg = null;

        // 유효성 검사
        if (typeof alias !== 'string' || alias.length === 0) {
            throw new Error('alias에 string 만 지정할 수 있습니다.');
        }
        if (!Array.isArray(pages)) {
            throw new Error('pages array<object> 만 지정할 수 있습니다.');
        }
        if (!Array.isArray(defaultFix)) {
            throw new Error('alias에 array<object> 만 지정할 수 있습니다.');
        }

        // 별칭 규칙 검사
        this._groupSymbol.forEach(val => {
            if ((val instanceof RegExp && val.test(alias)) || 
                (typeof val === 'string' && val === alias)) {
                throw new Error('[group]에 예약어를 입력할 수 없습니다. : all');
            }
        });

        pg = new PageGroup(this._owner, alias);
        pg.add(pages);
        pg.argfix = defaultFix;
        // pg.fixs = ['aa', 'Aa'];
        // pg.prefix = 'aa';
        // pg.suffix = 'BB';

        super.add(alias, pg);
    }

    /**
     * group.all 컬렉션 설정
     */
    _setAllPage() {

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
        
        super.add(pg._alias, pg);
        // pg.setFix('');

    }
}

class PageGroup {

    // pages = [];
    // fixs = [];

    // argfix = [];
    // prefix = null;
    // suffix = null;

    // pages = {
    //     context: '',
    //     src: null
    // };
    
    /*_______________________________________*/
    // public
    isPublic = true;
    
    /*_______________________________________*/
    // protecrted
    _owner = null;
    _alias = '';
    _pages = [];
    // _force = false;

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
        if (typeof val !== 'string') throw new Error('prefix 가능한 타입 : string ');
        this.#prefix = val;
    }
    get suffix() { return this.#suffix };
    set suffix(val) {
        if (typeof val !== 'string') throw new Error('suffix 가능한 타입 : string ');
        this.#suffix = val;
    }
    
    constructor(auto, alias) {
        
        // if (typeof fixs !== 'undefined' && !Array.isArray(pages)) {
        //     throw new Error('alias에 array<object> 만 지정할 수 있습니다.');
        // }
        // for (let i = 0; i < pages.length; i++) {
        //     this.pages.push(this.#createPage(pages[i]));
        // }
        this._owner = auto;
        this._alias = alias;
        // this.pages = [...pages];
        // this.fixs = [...fixs];
        // this._force = force;
        // page 의 CompileSoruce 와 연결 => 이건 필수모드가 맞을듯
        // if (this._force !== true) {
        //     this.#linkSource();
        // }
    }

    /**
     * 페이지 개체를 설정한다.
     * @param {object | array} obj 배열 또는 객체
     */
    add(obj) {
        
        let arr = [];
        let pageObj, src, alias, context;

        if (Array.isArray(obj)) arr = [...obj];
        else arr.push(obj);

        for (let i = 0; i < arr.length; i++) {
            
            pageObj = arr[i];
            alias = pageObj['page'];
            context = pageObj['context'] || '';
            src = this._owner.page[alias] || null;

            if (src === null){
                throw new Error(`page에  ${alias} 존재하지 않습니다.`);
            }
    
            if (context === '' || typeof context !== 'string') {
                context = src.subPath;  // REVIEW: 이름 매칭 확인필요!
            }
    
            this._pages.push({            
                page: alias,
                context: context,
                src: src
            });
        }
    }

    build(data, owner = this._owner) {
        
        let pg, page, src, context, subPath;
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
            // for (let ii = 0; ii < pg._pages.length; ii++) {
            // page = pg.page;
            src = page.src;
            context = page.context || src.subPath;
            context = context.replace('.hbs','');
            context = dir.length > 0 ? dir + path.sep +  context : context;
            // argfix = args.length > 0 ? args : this.#argfix;
            subPath = this._makePath(context, prefix, suffix, argfix);
            
            src.savePath = owner.dir + path.sep + owner.DIR.PUB + path.sep + subPath;  // 이름 재설정
            src._compile(data, true);

            // }
        }

    }
    // _setPage(page) {
    //     // if (!Array.isArray(pages)) {
    //     //     throw new Error('alias에 array<object> 만 지정할 수 있습니다.');
    //     // }
        
    //     // for(let i = 0; i < pages.length; i++) {

    //     // }
    // }

    // _setFix(fix) {

    // }
    
    _makePath(ctxPath, prefix = '', suffix = '', args = []) {
        
        let myPath, subPath, filename;

        for (let i = 0; i < args.length; i++) {
            ctxPath = ctxPath.replaceAll(`{${i}}`, args[i]);
        }
        // prefix, suffix 적용
        myPath = path.parse(ctxPath);

        subPath = myPath.dir.length > 0 ? myPath.dir : '';
        filename = prefix + myPath.name + suffix + myPath.ext;
        
        return subPath + path.sep + filename;
    }
    
    // #createPage(obj) {
        
    //     const alias = obj['page'];
    //     const context = obj['context'];
    //     const src = this._auto.group[alias] || null;
        
    //     return {
    //         page: alias,
    //         context: context,
    //         src: src
    //     }
    // }

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

exports.GroupCollection = GroupCollection;
exports.PageGroup = PageGroup;
