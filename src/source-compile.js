// const { PropertyCollection, Observer } = require('entitybind');
const { TemplateCollection } = require('./source-template');

/**
 * 컴파일소스 클래스
 */
class CompileSource {
    constructor() {
        
    }
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
}


exports.CompileSource = CompileSource;
exports.CompileCollection = CompileCollection;