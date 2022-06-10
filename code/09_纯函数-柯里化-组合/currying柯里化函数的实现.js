// 柯里化函数的实现
function currying(fn){
  return function curried(...args){
    //判断当前已经接收到的参数个数和本身需要接受的参数个数是否一致
    // 1.当已经传入的参数 大于等于 需要的参数时, 就执行函数
    if(args.length>=fn.length){
      return fn.apply(this,args)
    }else{
      // 没有达到个数时, 需要返回一个新的函数, 继续来接收的参数
      function curried2(..._args){
        // 接收到参数后, 需要递归调用curried来检查函数的个数是否达到
        return curried.apply(this,[...args,..._args])
      }
      return curried2
    }
  }
}


// TEST


// function foo(x, y, z, m, n, a, b) {
// }
// console.log(foo.length) 获取参数个数

function add1(x, y, z) {
  return x + y + z
}

var curryAdd=currying(add1)
console.log(curryAdd(10, 20, 30))
console.log(curryAdd(10, 20)(30))
console.log(curryAdd(10)(20)(30))
