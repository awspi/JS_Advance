Function.prototype.mybind = function(thisArg,..._args) {
  // 1.获取到真实需要调用的函数
  var fn=this
  // 2.绑定this
  thisArg=(thisArg!==null&&thisArg!==undefined)?Object(thisArg):window
  
  // 3.将函数放到thisArg中进行调用
  thisArg.fn=fn
  
  function proxyFn(...args){
    // 特殊: 对两个传入的参数进行合并
    var finalArgs=[..._args,...args]
    var res = thisArg.fn(...finalArgs)
    delete thisArg.fn
    return res
  }
  // 4.返回结果
  return proxyFn
}

// TEST
function foo() {
  console.log("foo被执行", this)
  return 20
}
var bar = foo.mybind("abc")
var result = bar()
console.log(result)

function sum(num1, num2, num3, num4) {
  console.log(num1, num2, num3, num4)
}
var newSum = sum.mybind("abc", 10, 20)
var result = newSum(30, 40)
