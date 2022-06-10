Function.prototype.myapply=function(thisArg,argArray){
  //1.处理绑定的thisArg
  thisArg=(thisArg!==null&&null!==undefined)?Object(thisArg):window
  //2.核心 把原函数挂载到thisArg上 这样fn的this就指向thisArg
  thisArg.fn = this 
  //3.调用原函数
  argArray=argArray||[] //如果不传入argArray则设为[]
  var res = thisArg.fn(...argArray)
  delete thisArg.fn //用完把挂载上的fn再删了
  return res
}

// TEST
function sum(a,b){
  console.log('sum函数被执行',a+b);
  console.log('sum函数的this:'+this);
}
function foo(){
  console.log('foo',this);
}
sum.myapply(foo,[1,2])

function fooo(num) {
  return num
}
fooo.myapply('abc',[1])

function bar() {
  console.log("bar函数被执行", this)
}
fooo.myapply('abc')

/* 
sum函数被执行 3
sum函数的this:function foo(){
  console.log('foo',this);
}
*/