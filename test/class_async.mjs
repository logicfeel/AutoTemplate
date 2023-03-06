class Top {
    constructor(abc){
        this.abc = abc;
    }

    do_task(){
        const _this = this;
        console.log('1 '+ this.abc);
        // console.log(this.loadModule());
        // const mod = this.loadModule().then(after);
        // this.loadModule().then(
            // console.log(mod.defaul);

        const mod = this.loadModule()
            .then(res => { 
                _this.close(res);
             });

        // this.close(mod);
        // function after() {
        //     _this.close(mod.default);
            
        // }
        console.log('task end')
    }

    async loadModule(){
        const { sum } = await import("./es6_sub.js");
        this.sum = sum;
        console.log('sum:'+sum);
        
        return sum;
    }

    close(def) {
        console.log('def:'+def);
        
        console.log('2'+ this.abc);
    }

}


let t = new Top('first');

t.do_task()

console.log('End');

