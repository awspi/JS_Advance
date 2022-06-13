
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


//让Student.prototype指向一个对象,而这个对象的__proto__指向Person.prototype
Student.prototype=Object.create(Person.prototype)
//Student.prototype就没有constructor属性了,如果要找会去到Student.prototype.prototype也就是Person.prototype找,
//而Person.prototype的constructor指向Person
//手动设置constructor
Object.defineProperty(Student.prototype,'constructor',{
  enumerable:false,
  configurable:false,
  writable:true,
  value:Student//指回自己
})


//如果要对Student.prototype添加新属性要在指向之后

Student.prototype.studying = function() {
  console.log("studying~")
}

var stu = new Student("why", 18, ["kobe"], 111, 100)
console.log(stu)
stu.studying()
stu.running()
stu.eating()


console.log(stu.constructor.name)//constructor指向父类