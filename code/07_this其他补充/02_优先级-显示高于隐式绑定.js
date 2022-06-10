var obj = {
  name: "obj",
  foo: function() {
    console.log(this)
  }
}

// obj.foo()

// 1.call/apply的显示绑定高于隐式绑定
obj.foo.apply('abc')//abc
obj.foo.call('abc')//abc

// 2.bind的优先级高于隐式绑定
var bar = obj.foo.bind("cba")
bar()//cba


// 3.更明显的比较
function foo() {
  console.log(this)
}

var obj = {
  name: "obj",
  foo: foo.bind("aaa")
}

obj.foo()//aaa
