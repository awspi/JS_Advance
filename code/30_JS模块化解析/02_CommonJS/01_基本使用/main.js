// 使用另外一个模块导出的对象, 那么就要进行导入 require
const { name, age, sum, aaa } = require("./why.js")

console.log(aaa)
console.log(name)
console.log(age)
console.log(sum(20, 30))
