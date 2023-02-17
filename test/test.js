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

console.log(a)
