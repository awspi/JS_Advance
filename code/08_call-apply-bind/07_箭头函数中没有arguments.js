// 1.案例一:
//node 全局有arguments 浏览器没有
var foo = () => {
  console.log(arguments) //arguments is not defined
}

foo()

// 2.案例二:
function foo() {
  var bar = () => {
    console.log(arguments)//在箭头函数中使用arguments会去上层作用域查找
  }
  return bar
}
var fn = foo(123)
fn()

// 3.案例三:
var foo = (num1, num2, ...args) => {
  console.log(args)
}

foo(10, 20, 30, 40, 50)
