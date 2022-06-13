
var personObj = {
  running: function() {
    console.log("running")
  }
}
//原型式继承弊端 只能单独给每一个实例对象添加属性,属性也只能一个一个加
var stu1=Object.create(personObj) 

stu1.name='pithy'
stu1.age=22
var stu2=Object.create(personObj)
stu2.name='awspi'
stu2.age=20
console.log(stu1,stu2);//{ name: 'pithy', age: 22 } { name: 'awspi', age: 20 }


function createStu(name){//利用工厂模式
  var stu = Object.create(personObj) 
  stu.name=name
  stu.study=function() {
    console.log('zzz');
  }
  return stu
}
var stuObj=createStu('asd')
console.log(stuObj)//{ name: 'asd', study: [Function (anonymous)] }