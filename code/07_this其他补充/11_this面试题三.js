var name = 'window'

function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  },
  this.foo2 = () => console.log(this.name),
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  },
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1() // person1
person1.foo1.call(person2) // person2(显示高于隐式绑定)

person1.foo2() // person1 (上层作用域中的this是person1)
person1.foo2.call(person2) // person1 (上层作用域中的this是person1) call对箭头函数无效

person1.foo3()() // window(独立函数调用)
person1.foo3.call(person2)() // window //foo3绑在了person2 返回的func依然是独立函数调用
person1.foo3().call(person2) // person2 //foo3返回的func 显式绑定在person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2 //foo4的this显式绑定在person2, 返回的arrow func的this为上层作用域(foo4) 
person1.foo4().call(person2) // person1 //foo4隐式绑定person1 arrow func指向person call不能绑定arrow func


var obj = {
  name: "obj",
  foo: function() {

  }
}


