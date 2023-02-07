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
    var AutoTask, autoTask
    var dirname, fullPath, data;
    
    if (typeof module === 'object' && typeof module.exports === 'object') {   
        AutoTask                = require('../src/auto-task').AutoTask;
        fs                      = require('fs');
        path                    = require('path');
    } else {
        throw new Error('nodeJs 전용입니다. ');
    }

    //==============================================================
    // 3. 테스트 본문
    function run() {

        dirname = __dirname + '/pageGroup/mod1';
        
        console.log('---------------------------------------------------------------------------');
        console.log('ready() 등록한 page 검사 (p1.html, p2.html, p3.html) one.html | group 과 all 검사 ');
        
        autoTask = AutoTask.create(dirname);
        
        (function() {   // IIFE
            
            try {
                

                function chk_one_html(data) {
                    if (
                        data.indexOf('<!--src/one.html-->') < 0 ||
                        data.indexOf('<!--part/inc/footer-->') < 0 ||
                        data.indexOf('@entity.Table=1@') < 0 ||
                        data.indexOf('<!--part/inc/header-->') < 0 ||
                        data.indexOf('@entity.Tables.[0]:10@') < 0 ||
                        data.indexOf('<!--part/inc/content-->') < 0 ||
                        data.indexOf('@<div class="mybold">BOLD</div>@') < 0 ||
                        data.indexOf('<!--page/p1.html-->') < 0 ||
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }
                function chk_p1_asp(data) {
                    if (
                        data.indexOf('<!--page/p1.html-->') < 0 ||
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }
                function chk_p2_asp(data) {
                    if (
                        data.indexOf('<!--page/p2.html-->') < 0 ||
                        data.indexOf('<!--part/inc/footer-->') < 0 ||
                        data.indexOf('@entity.Table=1@') < 0 ||
                        data.indexOf('@<div class="mybold">BOLD</div>@') < 0 ||
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }
                function chk_p3_asp(data) {
                    if (
                        data.indexOf('<!--page/p3.html-->') < 0 ||
                        data.indexOf('<!--page/p1.html-->') < 0 ||
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }

                // 파일 여부 검사
                // if (fs.existsSync(fullPath)) {
                    //     throw new Error('/src/one.html 파일이 존재합니다.');
                    // }
                    
                // 초기화
                autoTask.do_clear();

                autoTask.do_publish();
                    
                // 파일 유무 검사
                fullPath = dirname + '/src/one.html'
                console.log('대상파일 : ' + fullPath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error('파일이 존재하지 않습니다. (빌드후) ' + fullPath);
                }
                chk_one_html(fs.readFileSync(fullPath,'utf-8'));

                fullPath = dirname + '/src/AA1groupAA2/Pp1S.html'
                console.log('대상파일 : ' + fullPath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error('파일이 존재하지 않습니다. (빌드후) '+ fullPath);
                }
                chk_p1_asp(fs.readFileSync(fullPath,'utf-8'));

                fullPath = dirname + '/src/AA1groupAA2/Pp2S.html'
                console.log('대상파일 : ' + fullPath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error('파일이 존재하지 않습니다. (빌드후) '+ fullPath);
                }
                chk_p2_asp(fs.readFileSync(fullPath,'utf-8'));
                
                fullPath = dirname + '/src/newP3.html'
                console.log('대상파일 : ' + fullPath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error('파일이 존재하지 않습니다. (빌드후) '+ fullPath);
                }
                chk_p3_asp(fs.readFileSync(fullPath,'utf-8'));

                fullPath = dirname + '/src/Pp1S.html'
                console.log('대상파일 : ' + fullPath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error('파일이 존재하지 않습니다. (빌드후) '+ fullPath);
                }
                chk_p1_asp(fs.readFileSync(fullPath,'utf-8'));

                fullPath = dirname + '/src/Pp2S.html'
                console.log('대상파일 : ' + fullPath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error('파일이 존재하지 않습니다. (빌드후) '+ fullPath);
                }
                chk_p2_asp(fs.readFileSync(fullPath,'utf-8'));

                fullPath = dirname + '/src/Pp3S.html'
                console.log('대상파일 : ' + fullPath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error('파일이 존재하지 않습니다. (빌드후) '+ fullPath);
                }
                chk_p3_asp(fs.readFileSync(fullPath,'utf-8'));

                // 생성파일 갯수 확인
                // if (autoTask.entry._buildFile.publish.length !== 7){
                //     throw new Error('생성파일 갯수가 다릅니다.  7!= '+ fullPath);
                // }



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