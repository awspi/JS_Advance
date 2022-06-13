//
function createObject(o){//实现Object.create()
  function fn(){}
  fn.prototype=o
  return new fn()
}
function inheritPrototype(SubType,SuperType) {
  //让SubType.prototype指向一个对象,而这个对象的__proto__指向SuperType.prototype
  // SubType.prototype=Object.create(SuperType.prototype) //写法新
  SubType.prototype=createObject(SuperType.prototype)
  Object.defineProperty(SubType.prototype,'constructor',{
    enumerable:false,
    configurable:false,
    writable:true,
    value:SubType
  })
}
//Person
function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}
Person.prototype.running = function() {
  console.log("running~")
}
Person.prototype.eating = function() {
  console.log("eating~")
}

//Student
function Student(name, age, friends, sno, score) {
  Person.call(this, name, age, friends)//
  this.sno = sno
  this.score = score
}

inheritPrototype(Student,Person)

Student.prototype.studying = function() {
  console.log("studying~")
}

var stu = new Student("why", 18, ["kobe"], 111, 100)
console.log(stu)
stu.studying()
stu.running()
stu.eating()


console.log(stu.constructor.name)//constructor指向父类