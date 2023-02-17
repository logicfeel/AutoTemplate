
// 외부 객체로 가져올 경우
const a = new require('./import_test').AutoTemplate;
// 상속 : 오토템플릿, 외부
const {AutoTemplate} = require('./import_test');
// 상속 : 외부 "고급 문법" >> 사용안해도됨
// const {AutoTemplate: TemplateA} = require('./import_test');

class ImportTest {
}

class BBB {
}

console.log(0);

