function Person(name, age, height, address) {
  this.name = name
  this.age = age
  this.height = height
  this.address = address
}

Person.prototype.eating=function(){
  console.log(this.name+' eating'); //this的指向,和放的位置无关,和调用位置有关,p1.eating() 隐式绑定在p1
}
Person.prototype.running=function(){
  console.log(this.name+' running');//this的指向,和放的位置无关,和调用位置有关,p1.running() 隐式绑定在p2
}
var p1 = new Person("why", 18, 1.88, "北京市")
var p2 = new Person("kobe", 20, 1.98, "洛杉矶市")

p1.eating()
p2.running()

