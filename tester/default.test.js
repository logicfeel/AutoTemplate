// - 기본 : default.js
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


// const AutoTask = require('../../src/auto-task').AutoTask;
// const autoTask = AutoTask.create(__dirname);
// autoTask.do_clear();
// autoTask.do_publish();

    var AutoTask;
    var autoTask;
    var dirname, fullPath, data;

    const fs                                = require('fs');
    const path                              = require('path');

    if (typeof module === 'object' && typeof module.exports === 'object') {   
        AutoTask    = require('../src/auto-task').AutoTask;
        
    } else {
        // Row                     = global._W.Meta.Entity.Row;
        // Item                    = global._W.Meta.Entity.Item;
        // EntityView              = global._W.Meta.Entity.EntityView;
        // EntityTable             = global._W.Meta.Entity.EntityTable;
    }

    //==============================================================
    // 3. 테스트 본문
    function run() {
    

        console.log('---------------------------------------------------------------------------');
        console.log('템플릿 part.data.helper ');
        dirname = __dirname + '/default/mod1';
        fullPath = dirname + '/src/one.html'
        autoTask = AutoTask.create(dirname);

        (function() {   // IIFE
            
            try {

                // 파일 여부 검사
                // if (fs.existsSync(dirname + '/src/page-one.html')) {
                //     throw new Error('/src/page-one.html 파일이 존재합니다.');
                // }

                autoTask.do_publish();

                // 파일 유무 검사
                if (!fs.existsSync(fullPath)) {
                    throw new Error('/src/one.html 파일이 존재하지 않습니다. (빌드후) ');
                }

                data = fs.readFileSync(fullPath,'utf-8');

                // part.data.helper 검사
                if (
                    data.indexOf('@part/inc/footer@') < 0 ||
                    data.indexOf('@entity.Table=1@') < 0 ||
                    data.indexOf('@part/inc/header@') < 0 ||
                    data.indexOf('@entity.Tables.[0]:10@') < 0 ||
                    data.indexOf('@part/inc/content@') < 0 ||
                    data.indexOf('@<div class="mybold">BOLD</div>@') < 0 ||
                    false) {
                    throw new Error('템플릿 실패');
                }

                // 초기화
                autoTask.do_clear();

                console.log('Result = Success');
            } catch(e) {
                errorCnt++;
                console.warn(`Result = Fail [ ${e} ] `);
            } finally {
                taskCnt++;
            }

            

        }());


        // autoTask.do_publish();
        // autoTask.do_clear();
        
        // if (
        //         item.result === true &&
        //         item.result2 === false &&
        //         true) {
        //     taskCnt++;
        //     console.log('Result = Success');
        // } else {
        //     errorCnt++;
        //     console.warn('Result = Fail');
        // }

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
        // global._W.Test.Item = {run: run};
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));