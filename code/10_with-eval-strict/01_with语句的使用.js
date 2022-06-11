// "use strict";

var message = "GO's message"
// console.log(message)


var obj = {name: "why", age: 18, message: "obj's message"}

function foo() {
  function bar() {
    var message = "bar's message"
    with(obj) {// with语句: 可以形成自己的作用域
      console.log(message) //message不去全局找而是先去obj
      console.log("------")
    }
  }
  bar()
}
foo()

var info = {name: "kobe"}
with(info) {
  console.log(name)
}

