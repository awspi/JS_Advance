function Student(name,age){
  this.name=name,
  this.age=age
}
function Teacher(){}

//执行Student函数里的内容,但是创建出来的是Teacher对象
const teacher=Reflect.construct(Student,['why',18],Teacher)
console.log(teacher);
console.log(teacher.__proto__===Teacher.prototype);//true