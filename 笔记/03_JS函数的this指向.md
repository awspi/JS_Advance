# 03_JS函数的this指向

JavaScript中的this更加灵活，无论是它出现的位置还是它代表的含义。

> 编写一个obj的对象，有this和没有this的区别:
>
> ![image-20220609183710198](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242236831.png)
>
> ![image-20220609183728750](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242236717.png)

## **全局this指向**

this在**全局**作用于下指向什么?————在**浏览器中测试就是指向window**

![image-20220609184013638](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242236649.png)

```js
// 在大多数情况下, this都是出现在函数中
// 在全局作用域下
// 浏览器: window(globalObject)
// Node环境: {}
console.log(this)
// console.log(window)
```

## 内置函数的this绑定

### setTimeout

  **this->window**

```js
//setTimeout
function hySetTimeout(fn, duration) {
  fn.call("abc")
}

hySetTimeout(function() {
  console.log(this) // abc
}, 3000)

setTimeout(function() {
  console.log(this) //  this->window
}, 2000)
```

### 数组.forEach/map/filter/find

**forEach(arg1,this的指向)**

![image-20220609232556465](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242236784.png)

```js
var names = ["abc", "cba", "nba"]
names.forEach(function(item) {//abc
  console.log(item, this)
}, "abc")
///
names.map(function(item) {//cba
  console.log(item, this)
}, "cba")
```



### .onclick

**this->调用的元素对象**

```js
const boxDiv = document.querySelector('.box')
boxDiv.onclick = function() {
  console.log(this) //  this->boxDiv
}
//理解为:boxDiv.onclick() 隐式绑定
```



## 函数中this指向

 定义一个函数，我们采用三种不同的方式对它进行调用，它产生了三种不同的结果:

```js
function foo() {
  console.log(this)
}

// 1.直接调用这个函数
foo()//window

// 2.创建一个对象, 对象中的函数指向foo
var obj = {
  name: 'why',
  foo: foo
}

obj.foo() //obj

// 3.apply调用
foo.apply("abc")//String: 'abc'对象
```

- 函数在调用时，JavaScript会默认给this绑定一个值;
- this的绑定和**定义的位置**(编写的位置)没有关系; 
- this的绑定和**调用方式**以及**调用的位置有关系;**
- this是在运行时被绑定的;

## this绑定规则

- 默认绑定
- 隐式绑定
- 显示绑定
- new绑定

### 默认绑定

什么情况下使用默认绑定呢?——独立函数调用。

- 独立的函数调用我们可以理解成函数**没有被绑定到某个对象上进行调用;**

```js
function foo() {
  console.log(this) //window
}

foo()
```

```js
function foo1() {
  console.log(this)//window
}

function foo2() {
  console.log(this)//window
  foo1()
}

function foo3() {
  console.log(this)//window
  foo2()
}

foo3()
```

```js
var obj = {
  name: "why",
  foo: function() {
    console.log(this)// window 不是obj 
  }
}

var bar = obj.foo
bar() 
```

```js
function foo() {
  console.log(this)// window
}
var obj = {
  name: "why",
  foo: foo
}

var bar = obj.foo
bar() 
```

```js
function foo() {
  function bar() {
    console.log(this)// window
  }
  return bar
}

var fn = foo()
fn() 
```

**~~闭包this都是指向window~~ 比如说:**

```js
function foo() {
  function bar() {
    console.log(this)// obj
  }
  return bar
}
var fn = foo()

var obj = {
  name: "why",
  eating: fn
}
obj.eating() // 隐式绑定

```



### 隐式绑定

隐式绑定是**通过某个对象进行调用的:**

- 也就是它的**调用位置**中，是**通过某个对象**发起的函数调用。

隐式绑定: object.fn()  **object对象**会被js引擎**绑定到fn函数的中this**里面

```js
function foo() {
  console.log(this)// obj对象
}
var obj = {
  name: "why",
  foo: foo
}

obj.foo() 
```

```js
var obj = {
  name: "pithy",
  eating: function() {
    console.log(this.name + "在吃东西")
  },
  running: function() {
    console.log(obj.name + "在跑步")
  }
}
obj.eating()//obj
obj.running()

var fn = obj.eating
fn() //window
```

```js
var obj1 = {
  name: "obj1",
  foo: function() {
    console.log(this)
  }
}

var obj2 = {
  name: "obj2",
  bar: obj1.foo
}

obj2.bar() //obj2
```



### 显示绑定

- 隐式绑定有一个前提条件:

  - 必须在调用的对象内部有一个对函数的引用(比如一个属性); 

  - 如果没有这样的引用，在进行调用时，会报找不到该函数的错误;

  - 正是通过这个引用，间接的将this绑定到了这个对象上;

如果我们不希望在 **对象内部** 包含这个函数的引用,同时又希望在这个对象上进行强制调用

所有的函数都可以使用**call**和**apply**方法

#### 通过**`call/apply`**绑定this对象

```js
function foo() {
  console.log("函数被调用了", this)
}

// 1.foo直接调用和call/apply调用的不同在于this绑定的不同
// foo直接调用指向的是全局对象(window)
foo() //window

var obj = {
  name: "obj"
}

// call/apply是可以指定this的绑定对象
foo.call(obj) //obj
foo.apply(obj) //obj
foo.apply("aaaa") //[String: 'aaaa']
```

```js
// 2.call和apply有什么区别? 第一个参数是相同的，后面的参数，apply为数组，call为参数列表;
function sum(num1, num2, num3) {
  console.log(num1 + num2 + num3, this)
}

sum.call("call", 20, 30, 40)
sum.apply("apply", [20, 30, 40])

// 3.call和apply在执行函数时,是可以明确的绑定this, 这个绑定规则称之为显示绑定
```

#### **`bind`**

```js
function foo() {
  console.log(this)
}

// foo.call("aaa")
// foo.call("aaa")
// foo.call("aaa")
// foo.call("aaa")

// 默认绑定和显示绑定bind冲突: 优先级(显示绑定)

var newFoo = foo.bind("aaa")

newFoo()
newFoo()
newFoo()
newFoo()
newFoo()
newFoo()

var bar = foo
console.log(bar === foo)//true
console.log(newFoo === foo)//false
```



### new绑定

Js中的函数可以当做一个类的构造函数来使用，也就是使用new关键字。

使用new关键字来调用函数是，会执行如下的操作:

1. 创建一个全新的对象;
2. 这个新对象会被执行prototype连接;
3. 这个**新对象会绑定到函数调用的this**上(this的绑定在这个步骤完成);
4. 如果函数没有返回其他对象，表达式会返回这个新对象;

```js
// 我们通过一个new关键字调用一个函数时(构造器), 这个时候this是在调用这个构造器时创建出来的对象
// this = 创建出来的对象
// 这个绑定过程就是new 绑定
function Person(name, age) {
  this.name = name
  this.age = age
}

var p1 = new Person("why", 18)
console.log(p1.name, p1.age)
```



## 规则优先级

>  **new绑定 > 显示绑定(apply/call/bind) > 隐式绑定(obj.foo()) > 默认绑定(独立函数调用)**

**默认规则的优先级最低**

**显示绑定优先级高于隐式绑定**

**bind>call**

```js
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

//bind>call
foo.bind('abc').call('def')//abc

```

**new绑定优先级高于隐式绑定**

```js
var obj = {
  name: "obj",
  foo: function() {
    console.log(this)
  }
}

// new的优先级高于隐式绑定
var f = new obj.foo() //foo {}

```

**new绑定优先级高于bind**

- new绑定和call、apply是不允许同时使用的，所以不存在谁的优先级更高

- new绑定可以和bind一起使用，new绑定优先级更高

```js
// new的优先级高于bind
function foo() {
  console.log(this)
}
var bar = foo.bind("aaa")
var obj = new bar()//foo{}

```



## 绑定规则的例外情况

### 忽略显示绑定

如果在显示绑定中，我们传入一个null或者undefined，那么这个显示绑定会被忽略，使用默认规则:

(可以绑定在空对象{})

```js
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
```

### 间接函数引用

创建一个函数的**间接引用**，这种情况使用默认绑定规则。

- 赋值(obj2.foo = obj1.foo)(的结果是foo函数;
- foo函数被直接调用，那么是默认绑定;

```js
var obj1 = {
  name: "obj1",
  foo: function() {
    console.log(this)
  }
}
var obj2 = {
  name: "obj2"
};//分号不能省略
// 隐式绑定
obj2.bar = obj1.foo
obj2.bar()//{name: 'obj2', bar: ƒ}
//间接引用
(obj2.bar = obj1.foo)()//属于独立的函数调用
// 当用()括起来的时候,相当于把两段代码看成一个整体
```

### ES6箭头函数

箭头函数也就是不绑定this，而是**根据外层作用域来决定this。** (函数有作用域 对象没有作用域)

>  (函数有作用域 对象没有作用域)
>
> ```js
> var obj = {
>   name: "obj",
>   foo: () =>{
> 	//上层作用域是全局
>   }
> }
> function Person (name) {
> 	  this.foo=() =>{
> 	//上层作用域是func Person
>   }
> }
> ```
>
> 

```js
//普通函数
function foo(){
  console.log(this);
}
foo()//window
var obj = {foo1: foo}
obj.foo1()//obj
foo.call("abc")//'abc'
```

```js
//箭头函数
var foo = () => {
  console.log(this)
}
foo()//window
var obj = {foo1: foo}
obj.foo1()//window
foo.call("abc")//window
```

**应用场景**

```js
//箭头函数之前
var obj = {
  data: [],
  getData: function() {
    // 发送网络请求, 将结果放到上面data属性中
    // 在箭头函数之前的解决方案
    var _this = this//保存指向obj的this
    setTimeout(function() {//setTimeout的this指向window
      var result = ["abc", "cba", "nba"]
      _this.data = result//使用之前保存的指向obj的_this
    }, 2000);
  }
}
obj.getData()//隐式绑定 getData的this指向obj
```

```js
//箭头函数之后
var obj = {
  data: [],
  getData: function() {
    // 发送网络请求, 将结果放到上面data属性中
    setTimeout(() => {
      var result = ["abc", "cba", "nba"]
      this.data = result//箭头函数的this指向外层作用域(window)
    }, 2000);
  }
}
obj.getData()//隐式绑定 getData的this指向obj
```

 为什么在setTimeout的回调函数中可以直接使用this呢?

——因为箭头函数并不绑定this对象，那么this引用就会从上层作用域中找到对应的this

**如果getData也是箭头函数 ` getData: () =>{ ` 则this指向外层作用域(getData) (getData的this指向外层作用域window)**

![image-20220610014045561](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242236597.png)

## 箭头函数

- 箭头函数**不会绑定this、arguments**属性;
- **箭头函数不能作为构造函数来使用**(**不能和new一起来使用**，会抛出错误);

```
(): 函数的参数 {}: 函数的执行体
```

- 如果只有一个参数()可以省略

  ```js
  nums.forEach(item => {
    console.log(item)
  })
  ```

- 如果函数执行体中只有一行代码, 那么可以省略大括号并且会默认将这行代码的执行结果作为返回值

  ```js
  nums.forEach(item => console.log(item))
  var newNums = nums.filter(item => item % 2 === 0)
  console.log(newNums)
  ```

- 如果函数执行体只有返回一个对象, 那么可以省略return 给返回的对象加上()

  ```js
  var bar = () => ({ name: "why", age: 18 })
  var msg = bar();
  console.log(msg)
  ```



# this面试题

```js
var name = "window";

var person = {
  name: "person",
  sayName: function () {
    console.log(this.name);
  }
};

function sayName() {
  var sss = person.sayName;
  sss(); // window: 独立函数调用
  person.sayName(); // person: 隐式调用
  (person.sayName)(); // person: 隐式调用
  (b = person.sayName)(); // window: 赋值表达式 间接函数引用 (独立函数调用) 
}

sayName();

```

```js
var name = 'window'

var person1 = {
  name: 'person1',
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    //_this ->person1
    return () => {//返回箭头函数 无this 向上找
      console.log(this.name)
    }
  }
}

var person2 = { name: 'person2' }

person1.foo1(); // person1(隐式绑定)
person1.foo1.call(person2); // person2(显示绑定优先级大于隐式绑定)

person1.foo2(); // window(箭头函数不绑定作用域,上层作用域是全局)
person1.foo2.call(person2); // window

person1.foo3()(); //相当于var fn=person1.foo3();fn()  window(独立函数调用)
person1.foo3.call(person2)();//相当于var fn=person1.foo3.call(person2);fn() window(独立函数调用)
person1.foo3().call(person2); // person2(最终调用‘返回函数式’, 使用的是显示绑定)

person1.foo4()(); // person1(箭头函数不绑定this, 上层作用域this是person1)
person1.foo4.call(person2)(); // person2(把上层作用域被显示的绑定了一个person2)
person1.foo4().call(person2); // person1(上层找到person1) call对箭头函数无效
```

```js
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


```

```js
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
```

