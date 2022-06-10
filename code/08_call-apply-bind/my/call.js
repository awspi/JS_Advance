// 给所有的函数添加一个mycall的方法 thisArg上加上调用的函数
Function.prototype.mycall=function(thisArg,...args){ 
  // thisArg为传入的新this
  
  // 1.获取需要被执行的函数
  //默认隐式绑定为调用的函数
  var fn =this //this指向原函数

  // 2.对thisArg转成对象类型(防止它传入的是非对象类型)  
  thisArg=(thisArg!==undefined&&thisArg!==null)?Object(thisArg):window //用Object()转为对象

  // 3.调用需要被执行的函数 //==核心==
  thisArg.fn=fn//挂载上属性 String {'abc', fn: ƒ}
  var result = thisArg.fn(...args)
  delete thisArg.fn//用完销毁

  return result //返回原函数返回值
  
}


// TEST
function sum(a,b){
  console.log('sum函数被执行',a+b);
  console.log('sum函数的this:'+this);
}
function foo(){
  console.log('foo',this);
}
sum.mycall(foo,1,2)
/* 
3
sumfunction foo(){
  console.log('foo',this);
}
 */