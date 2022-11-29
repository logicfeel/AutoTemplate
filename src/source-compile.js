const fs                  = require('fs');
const handlebars          = require('handlebars');
const handlebarsWax       = require('handlebars-wax');
// const { PropertyCollection, Observer } = require('entitybind');
const { TemplateCollection } = require('./source-template');

/**
 * 컴파일소스 클래스
 */
class CompileSource {
    
    wax = null;
    
    /*_______________________________________*/        
    // private
    #part = [];
    #helper = [];
    #data = [];

    /*_______________________________________*/        
    // property

    constructor() {
        this.wax = handlebarsWax(handlebars.create());
    }
    /*_______________________________________*/
    // public method
    partials(obj) {
        this.#part.push(obj);
    }

    helpers(obj) {
        this.#helper.push(obj);
    }

    data(obj) {
        this.#data.push(obj);
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
        this.#part.forEach(val => this.wax.partials(val));
        this.#helper.forEach(val => this.wax.helpers(val));
        this.#data.forEach(val => this.wax.data(val));

        template = wax.compile(this.content);

        content = tempalte(data);
        
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
    constructor(owner) {
        super(owner);
    }

    /*_______________________________________*/
    // public method
    _add(fullPath, area) {
        let obj  = new CompileSource(this._owner, fullPath, area);
        let alias = obj.alias;

        super.add(alias, obj);
    }
}


exports.CompileSource = CompileSource;
exports.CompileCollection = CompileCollection;