/**
 * node 전용
 */
(function(global) {
    'use strict';

    //==============================================================
    // 1. 모듈 네임스페이스 선언
    global._W                = global._W || {};
    global._W.Test           = global._W.Test || {};
    
    //==============================================================
    // 2. 변수 선언
    var errorCnt = 0;
    var tasks = [];  //{ns:..., file:.... }
    var result, task;
    var isCallback      = false;
    var CLEAR           = false;
    var totalTaskCnt = 0;
    var totalFileCnt = 0;
    
    /* 단순 로그 보기 */
    // CLEAR = true;
    // global.isCallback = isCallback;
    
    //==============================================================
    // 3. 모듈 등록
    tasks.push({ns: '_W.Test.base',                 file: './base.test.js'});
    tasks.push({ns: '_W.Test.pageGroup',            file: './pageGroup.test.js'});
    tasks.push({ns: '_W.Test.import',               file: './import.test.js'});
    // tasks.push({ns: '_W.Test.extends',              file: './extends.test.js'});
    // tasks.push({ns: '_W.Test.event',                file: './event.test.js'});
    
    //==============================================================
    // 4. 테스트 본문 :: run()
    function run() {
        
        for (var i = 0; i < tasks.length; i++) {
            task = typeof module === 'object' ?  tasks[i].file : tasks[i].ns;
            console.log('===========================================================================');
            console.log('그룹(파일) 테스트 %s : %s', i + 1, task);
            
            if (typeof module === 'object' && typeof module.exports === 'object') {     
                task = tasks[i].file;
                tasks[i].result = require(tasks[i].file);
            } else {
                task = tasks[i].ns;
                tasks[i].result = eval(tasks[i].ns + '.run()');
            }
        }
        
        if (CLEAR) console.clear();

        console.log('***************************************************************************');
        console.log('통합 테스트 결과');
        console.log('***************************************************************************');
        for (var i = 0; i < tasks.length; i++) {            

            task = typeof module === 'object' ?  tasks[i].file : tasks[i].ns;
            
            totalTaskCnt += typeof tasks[i].result.taskCnt === 'number' ? tasks[i].result.taskCnt : 0; // 전체 태스크 갯수
            totalFileCnt++;

            if (tasks[i].result.errorCnt > 0) {
                console.warn('No: %s, file : %s, ERR_COUNT: [ %s EA ] = Warning', totalFileCnt, task, tasks[i].result.errorCnt);
                errorCnt++;
            }
            console.log('No: %s, file: %s, task [ %s EA ] = Success', totalFileCnt, task, tasks[i].result.taskCnt);

            console.log('___________________________________________________________________________');
        }
        
        if (errorCnt > 0) console.warn('Total: file [ %s EA ], task [ %s EA ] = Error', totalFileCnt, errorCnt);
        console.log('Total: file [ %s EA ], task [ %s EA ] = Success', totalFileCnt, totalTaskCnt);

        // return errorCnt;
        return {
            errorCnt: errorCnt,
            taskCnt: totalTaskCnt
        };
    }
    
    //==============================================================
    // 5. 결과 : 에러 카운터 ('0'이면 정상)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        module.exports = run();
    } else {
        global._W.Test.main = {run: run};
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));