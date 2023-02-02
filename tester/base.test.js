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
        // Item                 = global._W.Meta.Entity.Item;
        throw new Error('nodeJs 전용입니다. ');
    }

    //==============================================================
    // 3. 테스트 본문
    function run() {

        dirname = __dirname + '/base/mod1';
        fullPath = dirname + '/src/one.html'

        console.log('---------------------------------------------------------------------------');
        console.log('템플릿 part.data.helper ');
        
        autoTask = AutoTask.create(dirname);

        (function() {   // IIFE

            try {

                // 파일 여부 검사
                // if (fs.existsSync(fullPath)) {
                //     throw new Error('/src/one.html 파일이 존재합니다.');
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

                console.log('Result = Success ');
            } catch(e) {
                errorCnt++;
                console.warn('Result = Fail [ %s ] ', e);
            } finally {
                taskCnt++;
            }

        }());

        console.log('---------------------------------------------------------------------------');
        console.log('template.js >> newTemplate.js 이름 변경 ');
        
        autoTask = AutoTask.create(dirname, 'newTemplate.js');

        (function() {   // IIFE
            
            try {

                // 출판
                autoTask.do_publish();

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


        console.log('---------------------------------------------------------------------------');
        console.log('CompoileSource(TemplateSource) class 속성 검사 ');
        
        autoTask = AutoTask.create(dirname);

        (function() {   // IIFE

            try {

                var entry, compileSource

                autoTask.do_publish();
                entry = autoTask.entry;

                // AutoTemplate 속성 검사
                if (!(
                    entry.used === entry &&
                    entry.dir.indexOf('tester/base/mod1') > -1 &&
                    entry.dirs.length === 1 &&
                    true)) {
                    throw new Error('AutoTemplate 속성 검사 실패');
                }
                

                compileSource = entry.part['inc/content'];
                // CompoileSource 속성 검사
                if (!(
                    compileSource.dir.indexOf('tester/base/mod1') > -1 &&
                    compileSource.area === 'PART' &&
                    compileSource.alias === 'inc/content' &&
                    compileSource.fullPath.indexOf('tester/base/mod1/template/part/inc/content.hbs') > -1 &&
                    compileSource.areaDir === 'template/part' &&
                    compileSource.subDir === 'inc' &&
                    compileSource.subPath === 'inc/content.hbs' &&
                    compileSource.name === 'content.hbs' &&
                    compileSource.saveName.indexOf('content') > -1 &&
                    compileSource.saveDir.indexOf('tester/base/mod1/template/part/inc') > -1 &&
                    compileSource.savePath.indexOf('tester/base/mod1/template/part/inc/content') > -1 &&
                    true)) {
                    throw new Error('CompileSource 속성 검사 실패');
                }

                compileSource = entry.src['one.html'];
                // CompoileSource 속성 검사
                if (!(
                    compileSource.dir.indexOf('tester/base/mod1') > -1 &&
                    compileSource.area === 'SRC' &&
                    compileSource.alias === 'one.html' &&
                    compileSource.fullPath.indexOf('tester/base/mod1/src/one.html.hbs') > -1 &&
                    compileSource.areaDir === 'src' &&
                    compileSource.subDir === '' &&
                    compileSource.subPath === 'one.html.hbs' &&
                    compileSource.name === 'one.html.hbs' &&
                    compileSource.saveName.indexOf('one.html') > -1 &&
                    compileSource.saveDir.indexOf('tester/base/mod1/src') > -1 &&
                    compileSource.savePath.indexOf('tester/base/mod1/src/one.html') > -1 &&
                    true)) {
                    throw new Error('CompoileSource 속성 검사 실패');
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