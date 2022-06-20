var uname = "why"
var age = 18

var obj = {
  // 1.property shorthand(属性的简写)
  //如果key和val的名称一样,可以简写
  uname,
  age,

  // 2.method shorthand(方法的简写)
  foo: function() {
    console.log(this)
  },
  bar() {
    console.log(this)
  },
  baz: () => {
    console.log(this)
  },

  // 3.computed property uname(计算属性名)
  [uname + 123]: 'hehehehe'
}

obj.baz()//绑定上下文
obj.bar()//obj
obj.foo()//obj

// obj[uname + 123] = "hahaha"
console.log(obj)
