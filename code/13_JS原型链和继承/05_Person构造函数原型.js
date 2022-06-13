function Person() {
}

console.log(Person.prototype)//constructor: ƒ Person()
console.log(Person.prototype.constructor)//[Function: Person]
// console.log(Object.getOwnPropertyDescriptors(Person.prototype))

console.log(Person.prototype.__proto__)//顶层原型[Object: null prototype] {}
console.log(Person.prototype.__proto__.__proto__)//null

