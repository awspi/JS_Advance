var obj = {
  name: "why",
  age: 18,
  height: 1.88
}

// 对象的解构: {}
var { name, age, height } = obj
console.log(name, age, height)

var { age } = obj
console.log(age)

//对解构出来的key重命名
var { name: newName } = obj
console.log(newName)

//对不存在的key赋默认值
var { address: newAddress = "广州市" } = obj
console.log(newAddress)


function foo(info) {
  console.log(info.name, info.age)
}

foo(obj)
//形参直接解构对象{name, age}
function bar({name, age}) {
  console.log(name, age)
}

bar(obj)

