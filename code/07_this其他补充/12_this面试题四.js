var name = 'window'

function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()() // window //返回的func是独立函数调用
person1.obj.foo1.call(person2)() // window //foo1显示绑定person2 返回的func是独立函数调用
person1.obj.foo1().call(person2) // person2 //foo1返回的func显示绑定person2

person1.obj.foo2()() // obj //arrow func this找上层作用域(foo2) foo隐式绑定在obj  所以af->obj
person1.obj.foo2.call(person2)() // person2  //arrow func this找上层作用域(foo2) foo2显示绑定在person2  所以af->person2
person1.obj.foo2().call(person2) //obj af不能用call绑定 
