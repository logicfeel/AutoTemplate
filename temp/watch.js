// import { watchFile } from 'node:fs';

const fs                                = require('fs');


fs.watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});


// 의미가 맞지 않음...

