

// import path from "path";

let filePath = "./es6_sub.js"
// let sep  = path.sep;

class ABC {
    abc = 10
    constructor() {
        let aaa = 1;
        // (async function () {
        //     const sumModule = await import(filePath);
        //     console.log('1');
        //     console.log(sumModule)
        //     console.log(sumModule.default)
        // })();
        
        async function inner() {
            const sumModule = await import(filePath);
            console.log('1');
            console.log(sumModule)
            console.log(sumModule.default)
            return sumModule;
        }

        let aa = inner().then(console.log(111));
        console.log(aa);
        console.log(aa.default);
        
        // aaa.default
        // const sumModule = import(filePath);
        // console.log('2');
        // console.log(sumModule)
        // console.log(sumModule.default)

    }
}



export { ABC }