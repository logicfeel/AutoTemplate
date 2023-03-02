class A {
    get aaa() {return 'A'}
    constructor(){
        console.log('A..');
        
    }
}
class B extends A {
    get aaa() {return 'B'}
    constructor(){
        super()
        console.log('B..');
    }
}

class C extends B {
    get aaa() {return 'C'}
    constructor(){
        super()
        console.log('C..');
    }
}

const a = new C();


console.log(0);

