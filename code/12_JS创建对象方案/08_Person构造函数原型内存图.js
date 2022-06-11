function Person() {

}

var p1 = new Person()
var p2 = new Person()

// 都是为true
// console.log(p1.__proto__ === Person.prototype)
// console.log(p2.__proto__ === Person.prototype)

// 
// p1.name = "why"

// p1和p2的__proto__指向的都是Function Person的prototype 效果是一样的⬇️
p1.__proto__.name = "kobe"
p2.__proto__.name = "curry"
// 直接在person函数的原型对象上加name属性
Person.prototype.name = "james"


console.log(p1.name)//如果找不到p1.name,会到原型__proto__中找
