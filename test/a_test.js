// __dirname 전달 방법

class A {
    constructor() {
    
    }
}

class B extends A{
    constructor(dirs = []) {
        super(dirs.push('_C'));
    }
}

class C extends B {
    constructor(obj = {dir: []}) {
        super(obj.dir.push('C'));
        // dirs.push('C') 
    }
}


var a = new C();

console.log(a);



// 새로은 포커스 경로 얻기
function __getNewFocusPath(focusPath) {
        
    const MAX_COUNT = 10;  // 최대 수정 갯수
    let oldPath = path.parse(focusPath);
    let filename, newPath;
    
    filename = oldPath.name;
    // let 
    for (let i = 0; i < MAX_COUNT; i++) {
        /**
         * 방식 1>
         *  무조건 회귀하면서 조회 : 성능의 문제점
         * 방법 2>
         *  포커스 파일을 파싱후 다음조건 처리
         * 방법 3> *추천*
         *  파일명 앞에 _ 언더바를 추가한다.
        */
        filename = '$' + filename;
        newPath = oldPath.dir + path.sep + filename + oldPath.ext;
        if (!fs.existsSync(newPath)) return newPath;
    }
    // 오류 리턴 : 수정 최대 갯수 10초과
    throw new Error(`수정 최대 갯수 ${MAX_COUNT}개 초과`);
}

