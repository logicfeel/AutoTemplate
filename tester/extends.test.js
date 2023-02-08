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

        (function() {   // IIFE
            
            console.log('---------------------------------------------------------------------------');
            console.log(' extends 검사 : 상속 ');
            
            dirname = __dirname + '/extends/mod1';
            autoTask = AutoTask.create(dirname);
            try {
                

                function chk_one_html(data) {
                    if (
                        data.indexOf('<!--src/one.html-->') < 0 ||
                        data.indexOf('<!--part/inc/footer-->') < 0 ||
                        data.indexOf('$entity.Table=1$') < 0 ||
                        data.indexOf('<!--part/inc/header-->') < 0 ||
                        data.indexOf('$entity.Tables.[0]:10$') < 0 ||
                        data.indexOf('<!--part/content(OVER)-->') < 0 ||
                        data.indexOf('$<div class="mybold-OVER">BOLD</div>$') < 0 ||
                        data.indexOf('<!--page/p1.html(OVER)-->') < 0 ||
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }
                function chk_p1_html(data) {
                    if (
                        data.indexOf('<!--page/p1.html(OVER)-->') < 0 ||
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }
                function chk_p2_html(data) {
                    if (
                        data.indexOf('<!--page/p2.html-->') < 0 ||
                        data.indexOf('<!--part/inc/footer-->') < 0 ||
                        data.indexOf('$entity.Table=1$') < 0 ||
                        data.indexOf('$<div class="mybold-OVER">BOLD</div>$') < 0 ||    // 오버로딩
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }
                function chk_p3_html(data) {
                    if (
                        data.indexOf('<!--page/p3.html-->') < 0 ||
                        data.indexOf('<!--page/p1.html(OVER)-->') < 0 ||
                        false) {
                        throw new Error('템플릿 실패 '+ fullPath);
                    }
                }

                function checkFile(fullPath, type) {
                    console.log('대상파일 : ' + fullPath);
                    if (!fs.existsSync(fullPath)) {
                        throw new Error('파일이 존재하지 않습니다. (빌드후) ' + fullPath);
                    }
                    if (type === 'one') chk_one_html(fs.readFileSync(fullPath,'utf-8'));
                    if (type === 'p1') chk_p1_html(fs.readFileSync(fullPath,'utf-8'));
                    if (type === 'p2') chk_p2_html(fs.readFileSync(fullPath,'utf-8'));
                    if (type === 'p3') chk_p3_html(fs.readFileSync(fullPath,'utf-8'));
                }

                
                // 파일 여부 검사
                // if (fs.existsSync(fullPath)) {
                //     throw new Error('/src/one.html 파일이 존재합니다.');
                // }

                // 초기화
                autoTask.do_clear();
                
                // 출판
                autoTask.do_publish();
                    
                // 파일 검사
                // src 의 .hbs
                checkFile(dirname + '/src/one.html', 'one')
                // .hbs 에서 파일 생성
                checkFile(dirname + '/src/sup1_double/A1_group_A2/p_p1_s.html', 'p1')
                checkFile(dirname + '/src/sup1_double/A1_group_A2/p_p2_s.html', 'p2')
                // ready() 등록한 double 그룹
                checkFile(dirname + '/src/AA1_group_AA2/P_p1_S.html', 'p1')
                checkFile(dirname + '/src/AA1_group_AA2/P_p2_S.html', 'p2')
                // ready() page >> src 설정
                checkFile(dirname + '/src/ready_p2.html', 'p2')
                checkFile(dirname + '/src/ready_p3.html', 'p3')
                // .hbs 에서 파일 생성
                checkFile(dirname + '/src/sup1_p1.html', 'p1')
                // .hbs 에서 파일 생성
                checkFile(dirname + '/src/sup1_all/pre_p1_suf.html', 'p1')
                checkFile(dirname + '/src/sup1_all/pre_p2_suf.html', 'p2')
                checkFile(dirname + '/src/sup1_all/pre_p3_suf.html', 'p3')
                // ready() 등록한 all 그룹
                checkFile(dirname + '/src/P_p1_S.html', 'p1')
                checkFile(dirname + '/src/P_p2_S.html', 'p2')
                checkFile(dirname + '/src/P_p3_S.html', 'p3')

                // 생성파일 갯수 확인
                console.log('생성파일 갯수 검사 : 14');
                if (autoTask.entry._buildFile.publish.length !== 14){
                    throw new Error('생성파일 갯수가 다릅니다.  7!= '+ fullPath);
                }

                
                // 상속파일 가져오기
                autoTask.do_cover();
                
                checkFile(dirname + '/template/part/content.hbs')
                checkFile(dirname + '/template/part/inc/header.hbs')
                checkFile(dirname + '/template/page/p1.html.hbs')
                checkFile(dirname + '/template/page/p2.html.hbs')
                checkFile(dirname + '/template/helper/bold.js')
                

                console.log('Result = Success ');
            } catch(e) {
                errorCnt++;
                console.warn('Result = Fail [ %s ] [%s] ', e, e.message);
                console.warn(e.stack);

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