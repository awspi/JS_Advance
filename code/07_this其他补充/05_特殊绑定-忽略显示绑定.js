function foo() {
  console.log(this)
}

foo.apply("abc")//String {'abc'}
foo.apply({})//{}

// apply/call/bind: 当传入null/undefined时, 自动将this绑定成全局对象
foo.apply(null)//window
foo.apply(undefined)//window

var bar = foo.bind(null)//window
bar()
