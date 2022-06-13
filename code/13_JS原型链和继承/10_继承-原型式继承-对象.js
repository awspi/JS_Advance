var obj = {
  name: "why",
  age: 18
}

// 原型式继承函数 利用Object.setPrototypeOf 便捷实现
function createObj(o){
  var newObj={}
  Object.setPrototypeOf(newObj,o)
  //可以设置原型对象和Object.getPrototypeOf获取原型对象配套的,
  
  return newObj
}
var info = createObj(obj)
console.log(info);
console.log(Object.getPrototypeOf(info));//{ name: 'why', age: 18 }

// 构造一个Fn 利用Fn.prototype=o
function createObj2(o){
  function Fn(){}
  Fn.prototype = o
  var newObj = new Fn() 
  // newObj.__proto__=o//__proto__是浏览器实现的有兼容问题
 
  return newObj
}

var info2 = createObj2(obj)
console.log(info2);
console.log(Object.getPrototypeOf(info2));//{ name: 'why', age: 18 }

//直接使用Object.create()
var info3 = Object.create(obj)
console.log(info3);
console.log(Object.getPrototypeOf(info3));//{ name: 'why', age: 18 }