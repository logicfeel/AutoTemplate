const fs                = require('fs');
const path              = require('path');
const { Observer }      = require('entitybind');
// import fs from "fs";
// import path from "path";
// import { Observer } from "entitybind";

// const { SourceBatch }   = require('./source-batch');

/**
 * 오토태스크 클래스
 */
class AutoTask {
    /*_______________________________________*/        
    // public
    entry = null;
    // batch = null;
    cursor = '';
    FILE = {
        TEMPLATE: 'template.js',
    };
    // isLog = true;

    /*_______________________________________*/        
    // protected
    static _instance = null;
    
    /*_______________________________________*/        
    // private
    #isLog = true;
    #dir = null;
    #event = new Observer(this, this);
    
    /*_______________________________________*/        
    // event property
    // set onLoad(fn) {
    //     this.#event.subscribe(fn, 'load');
    // }
    // set onSave(fun) {
    //     this.#event.subscribe(fun, 'save');
    // }
    // set onSaved(fun) {
    //     this.#event.subscribe(fun, 'saved');
    // }
    get isLog() { return this.#isLog };
    set isLog(val) { 
        if (typeof val !== 'boolean') throw new Error('boolean 타입만 설정할 수 있습니다.');
        this.entry.isLog = val;
        this.#isLog = val;
    };

    constructor() {
        // this.batch = SourceBatch.getInstance();
        // this.batch._task = this;
    }

    /*_______________________________________*/
    // public method

    /**
     * taask 생성
     */
    /**
     * 
     * @param {*} dir 시작 디렉토리
     * @param {*} entry 엔트라 피일명
     * @returns 
     */
    static create(dir, entry) {
        if (typeof dir !== 'string' || dir.length === 0) {
            throw new Error(' start [dir] request fail...');
        }
        this._instance = new this();
        // template.js 기본파일 변경시
        if (typeof entry === 'string' && entry.length > 0) {
            this._instance.FILE.TEMPLATE = entry;
        }
        this._instance.#dir = dir;
        
        // POINT:
        this._instance.#init();

        return this._instance;
    }
    
    /**
     * 객체 얻기
     * @returns {this}
     */
    static getInstance() {
        if (this._instance === null) {
            throw new Error(' 태스크가 생성되지 않았습니다. [dir] request fail...');
        }
        return this._instance;
    }

    /**
     * 리셋 태스크 실행 (파일 및 폴더 삭제, 객체 초기화)
     */
    do_clear(opt) {
        
        let dir, entry, delPath;

        this.cursor = 'CLEAR';

        // 로딩
        // this.#init();
        // this.#init();
        // 빌드 파일 삭제
        this.entry.clear(opt);
        // if (this.entry !== null) this.entry.clear();
        // 이벤트 초기화
        this.#event.unsubscribeAll();
    }

    /**
     * 탬플릿 소스 출판
     */
    do_publish(isKeep) {
        this.cursor = 'PUBLISH';
        // 로딩
        // this.#init();
        // 빌드
        this.entry.build(isKeep);
    }

    /**
     * 상속한 부모의 객체 및 소스(src, out) 가져오기 태스크 실행
     * @param {*} auto 
     */
    do_cover(template = this.entry) {
        this.cursor = 'COVER';
        // 로딩
        // this.#init();
        // 부모 파일 쓰기
        this.entry._writeParentObject();
    }

    /*_______________________________________*/
    // protected method

    // #init(entry) {
    #init() {
        // 현재 폴더의 auto.js 파일 로딩
        // const entryFile  = entry ? path.join(this.#dir, entry) : path.join(this.#dir, this.FILE.TEMPLATE);
        const entryFile = path.join(this.#dir, this.FILE.TEMPLATE);
        // 다양한 조건에 예외조건을 수용해야함
        
        const EntryTemplate = require(entryFile);
        // import {AutoTemplate} from entryFile;
        // const {AutoTemplate} = await import(entryFile);
        // 타입 검사해야함
        this.entry = typeof EntryTemplate === 'function' ? new EntryTemplate() : new EntryTemplate.AutoTemplate();
        // entry 초기화
        this.entry.isLog = this.isLog;
        this.entry.init();
    }
    
    /**
     * 앤트리 오토 조회 및 적재
     */
    // #load(entry) {        
        
    //     // task 초기화
    //     this.#init(entry);
        
    //     // entry 초기화
    //     this.entry.init();

    //     // 이벤트 발생
    //     // this._onLoad();
    // }

    /*_______________________________________*/
    // event call

    // 오토 객체 생성후 호출 이벤트
    // _onLoad() {
    //     this.#event.publish('load', this.cursor, this.entry);
    // }
    // // 저장전 호출 이벤트
    // _onSave() {
    //     this.#event.publish('save', this.cursor, this.entry);
    // }
    // // 저장후 호출 이벤트
    // _onSaved() {
    //     this.#event.publish('saved', this.cursor, this.entry); 
    // }

}
// console.log('ee');

// export function aaa() {}

exports.AutoTask = AutoTask;
// export default AutoTask
// export { AutoTask }

// export const aaa = "AAA"

