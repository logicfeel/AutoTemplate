(function(global) {
    'use strict';

    //==============================================================
    // 1. 모듈 네임스페이스 선언
    global._W               = global._W || {};
    global._W.Collection    = global._W.Collection || {};

    //==============================================================
    // 2. 모듈 가져오기 (node | web)
    var ICollection;
    var Observer;    

    if (typeof module === 'object' && typeof module.exports === 'object') {
        // ICollection         = require('./i-collection');
        // Observer            = require('./observer');
    } else {
        // ICollection         = global._W.Interface.ICollection;
        // Observer            = global._W.Common.Observer;
    }

    //==============================================================
    // 3. 모듈 의존성 검사
    // if (typeof Observer === 'undefined') throw new Error('[Observer] module load fail...');
    // if (typeof ICollection === 'undefined') throw new Error('[ICollection] module load fail...');

    //==============================================================
    // 4. 모듈 구현 

    var obj = [];

    // 3. 테스트 본문
    function run() {
        obj.push(require('./base.test'));   // 실행후 결과만 리턴하는 방식입니다.
    }

    //==============================================================
    // 5. 모듈 내보내기 (node | web)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        // module.exports = BaseCollection;
        module.exports = run();
    } else {
        // global._W.Collection.BaseCollection = BaseCollection;
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));