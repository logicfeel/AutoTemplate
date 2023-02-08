// - 기본 : base.js
//     + 소스 출판 
//     + 클리어
//     + 조각, 헬퍼, 데이터
//     + 템플릿 다른 파일 불러오기
(function(global) {
    'use strict';

    //==============================================================
    // 1. 모듈 네임스페이스 선언
    global._W                = global._W || {};
    global._W.Test           = global._W.Test || {};
    
    //==============================================================
    // 2. 모듈 가져오기 (node | web)
    var errorCnt = 0;
    var result = [];        // 결과 확인 **사용시 초기화
    var isCallback = global.isCallback === false ? false : true;
    var taskCnt = 0;

    var fs, path;
    var AutoTask, autoTask;
    
    if (typeof module === 'object' && typeof module.exports === 'object') {   
        AutoTask                = require('../src/auto-task').AutoTask;
        fs                      = require('fs');
        path                    = require('path');
    } else {
        // Item                 = global._W.Meta.Entity.Item;
        throw new Error('nodeJs 전용입니다. ');
    }

    //==============================================================
    // 3. 테스트 본문
    function run() {

        console.log('---------------------------------------------------------------------------');
        console.log('초기화 : autoTemplate.clear() ');
        
        (function() {   // IIFE

            try {
                var filePath;

                // filePath = __dirname+ '/base/mod1';
                // console.log('대상 : '+ filePath);
                // autoTask = AutoTask.create(filePath);
                // autoTask.do_clear();

                // filePath = __dirname+ '/import/mod1';
                // console.log('대상 : '+ filePath);
                // autoTask = AutoTask.create(filePath);
                // autoTask.do_clear();

                // filePath = __dirname+ '/pageGroup/mod1';
                // console.log('대상 : '+ filePath);
                // autoTask = AutoTask.create(filePath);
                // autoTask.do_clear();

                filePath = __dirname+ '/extends/mod1';
                console.log('대상 : '+ filePath);
                autoTask = AutoTask.create(filePath);
                autoTask.do_clear();

                // filePath = __dirname+ '/base/mod1';
                // console.log('대상 : '+ filePath);
                // autoTask = AutoTask.create(filePath);
                // autoTask.do_clear();


                console.log('Result = Success ');
            } catch(e) {
                errorCnt++;
                console.warn('Result = Fail [ %s ] ', e);
            } finally {
                taskCnt++;
            }

        }());

        //#################################################
        console.log('===========================================================================');
        if (errorCnt > 0) console.warn('Error Sub SUM : %dEA', errorCnt);    
        console.log('단위 테스트 [ %s EA]: SUCCESS', taskCnt);

        return {
            errorCnt: errorCnt,
            taskCnt: taskCnt
        };
    }

    //==============================================================
    // 5. 모듈 내보내기 (node | web)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        module.exports = run();
    } else {
        global._W.Test.base = {run: run};
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));