
let obj = {
    aa: {
        bb: {
            cc: 'CC'
        }
    }
}

if (obj.aa?.bb) console.log('aa.bb 있음')
else console.log('aa.bb 없음')

if (obj.AA?.bb) console.log('AA.bb : Yes')
else console.log('AA.bb : No')


if (obj.aa?.bb?.cc) console.log('aa.bb.cc 있음')
else console.log('aa.bb.cc 없음')