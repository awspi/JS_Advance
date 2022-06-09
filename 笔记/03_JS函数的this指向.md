# 03_JS函数的this指向

JavaScript中的this更加灵活，无论是它出现的位置还是它代表的含义。

> 编写一个obj的对象，有this和没有this的区别:
>
> ![image-20220609183710198](/Users/wsp/Library/Application Support/typora-user-images/image-20220609183710198.png)
>
> ![image-20220609183728750](/Users/wsp/Library/Application Support/typora-user-images/image-20220609183728750.png)

## **全局this指向**

this在**全局**作用于下指向什么?————在**浏览器中测试就是指向window**

![image-20220609184013638](/Users/wsp/Library/Application Support/typora-user-images/image-20220609184013638.png)

```js
// 在大多数情况下, this都是出现在函数中
// 在全局作用域下
// 浏览器: window(globalObject)
// Node环境: {}
console.log(this)
// console.log(window)
```

## 内置函数的this绑定



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
3. 这个新对象会绑定到函数调用的this上(this的绑定在这个步骤完成);
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



- **默认规则的优先级最低**

- **显示绑定优先级高于隐式绑定**

- **new绑定优先级高于隐式绑定**

- **new绑定优先级高于bind**

  - new绑定和call、apply是不允许同时使用的，所以不存在谁的优先级更高

  - new绑定可以和bind一起使用，new绑定优先级更高

