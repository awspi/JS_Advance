function createObject(o) {
  function Fn() {}
  Fn.prototype = o
  return new Fn()
}

function inheritPrototype(SubType, SuperType) {
  SubType.prototype = createObject(SuperType.prototype)
  Object.defineProperty(SubType.prototype, "constructor", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: SubType
  })
}


function Person() {

}

function Student() {

}

inheritPrototype(Student, Person)

console.log(Person.prototype.__proto__.__proto__) //顶层[Object: null prototype] {}

var stu = new Student()
console.log(stu instanceof Student) // true
console.log(stu instanceof Person) // true
console.log(stu instanceof Object) // true

console.log('//////');


dfs(stu)
function dfs(obj){
  if(obj.__proto__!=null){
    console.log(obj.__proto__);
    dfs(obj.__proto__)
  }
}
/* 
Person {constructor: ƒ}
{constructor: ƒ}
[Object: null prototype] {}
*/