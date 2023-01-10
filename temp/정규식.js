

var    _partSymbol = [/^[/\\]?ns[^\w]?/, /^[/\\]?group[^\w]?/, /^[/\\]?page[^\w]?/];


_partSymbol.forEach(val => {
    if (val.exec('ns')) console.log('충돌');
});

console.log(_partSymbol[0] instanceof RegExp)

console.log(0)