const fs = require('fs');
const path = require('path');
const { SourceBatch } = require('./source-batch');
const { Observer } = require('entitybind');

/**
 * 오토태스크 클래스
 */
class AutoTask {
    /*_______________________________________*/        
    // public
    entry = null;
    batch = null;
    cursor = '';
    FILE = {     // location
        RELATION: '__Relation.json',
        TEMPLATE: 'template.js',
    };
    
    /*_______________________________________*/        
    // protected
    static _instance = null;
    
    /*_______________________________________*/        
    // private
    #dir = null;
    #event              = new Observer(this, this);
    
    /*_______________________________________*/        
    // event property
    // set onLoad(fun) {
    //     this.#event.subscribe(fun, 'load');
    // }
    // set onSave(fun) {
    //     this.#event.subscribe(fun, 'save');
    // }
    // set onSaved(fun) {
    //     this.#event.subscribe(fun, 'saved');
    // }

    constructor() {
        this.batch = SourceBatch.getInstance();
        this.batch._task = this;
    }

    /*_______________________________________*/
    // public method

    /**
     * taask 생성
     */
    static create(dir) {
        if (typeof dir !== 'string' || dir.length === 0) {
            throw new Error(' start [dir] request fail...');
        }
        this._instance = new this();
        this._instance.#dir = dir;
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
     * 탬플릿 소스 출판
     */
    do_publish() {
        this.cursor = 'PUBLISH';
        // 로딩
        this._load();
        // 빌드
        this.entry.build();
    }

    /**
     * 상속한 부모의 객체 및 소스(src, out) 가져오기 태스크 실행
     * @param {*} auto 
     */
    do_cover(template = this.entry) {
        this.cursor = 'COVER';
        // 로딩
        this._load();

        // 부모 가져오기
        template._writeParentObject();
    }

    /**
     * 리셋 태스크 실행 (파일 및 폴더 삭제, 객체 초기화)
     */
    do_clear() {
        
        let dir, entry, delPath;

        this.cursor = 'CLEAR';
        // // 로딩
        // this._load();
        // // 배치 파일 삭제
        // this.batch.clear();
        // this.#event.unsubscribeAll();
        
        // // 디렉토리 삭제        
        // entry = this.entry;
        // dir = entry.dir;
        // // dir = __dirname;

        // delPath = dir +path.sep+ entry.LOC.DIS;
        // if (fs.existsSync(delPath)) fs.rmSync(delPath, { recursive: true });
        // delPath = dir +path.sep+ entry.LOC.DEP;
        // if (fs.existsSync(delPath)) fs.rmSync(delPath, { recursive: true });
        // delPath = dir +path.sep+ entry.LOC.INS;
        // if (fs.existsSync(delPath)) fs.rmSync(delPath, { recursive: true });
        // delPath = dir +path.sep+ entry.LOC.PUB;
        // if (fs.existsSync(delPath)) fs.rmSync(delPath, { recursive: true });

        // // 대상 오토 조회
        // let list = this.entry._getAllList(true);
        // for (let i = 0; i < list.length; i++) {
        //     delPath = list[i].dir +path.sep+ entry.LOC.DIS;
        //     if (fs.existsSync(delPath)) fs.rmSync(delPath, { recursive: true });
        // }
    }

    /*_______________________________________*/
    // protected method

    /**
     * 앤트리 오토 조회 및 적재
     */
    _load(entryFile) {        
        // 현재 폴더의 auto.js 파일 로딩
        let entryFile  = entryFile ? this.#dir +path.sep+ entryFile : this.#dir + this.FILE.TEMPLATE;
        // 다양한 조건에 예외조건을 수용해야함
        const EntryAuto = require(entryFile);
        // 타입 검사해야함
        this.entry = new EntryTemplate();
        // 초기화
        this.entry.init();

        // 이벤트 발생
        // this._onLoad();
    }

    /*_______________________________________*/
    // event call

    // 오토 객체 생성후 호출 이벤트
    _onLoad() {
        this.#event.publish('load', this.cursor, this.entry);
    }
    // 저장전 호출 이벤트
    _onSave() {
        this.#event.publish('save', this.cursor, this.entry);
    }
    // 저장후 호출 이벤트
    _onSaved() {
        this.#event.publish('saved', this.cursor, this.entry); 
    }

}

exports.AutoTask = AutoTask;