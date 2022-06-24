// for...in 标准化: ECMA
const obj = {
  name: "why",
  age: 18
}
//遍历对象
for (const item in obj) {
  console.log(item)//name age
}
//遍历数组
for (const item in ['a','b','c']) {
  console.log(item)//0 1 2 
}