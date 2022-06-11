# 05_with-eval-strict

## with语句

扩展一个语句的作用域链。 **不推荐使用**

```js
var message = "GO's message"

var obj = {name: "why", age: 18, message: "obj's message"}

function foo() {
  function bar() {
    var message = "bar's message"
    with(obj) {// with语句: 可以形成自己的作用域
       //message先去obj寻找
      console.log(message)//obj's message
      console.log("------")
    }
  }
  bar()
}
foo()
///
var info = {name: "kobe"}
with(info) {
  console.log(name)
}


```





## eval函数

eval是一个特殊的函数，它可以将传入的字符串当做JavaScript代码来运行。

不建议在开发中使用eval:

- eval代码的**可读性差**(代码的可读性是高质量代码的重要原则);
- eval是一个**字符串，那么有可能在执行的过程中被刻意篡改**，那么可能会造成被攻击的风险; 
- eval的执行**必须经过JS解释器**，不能被JS引擎优化;

```js
var jsString = 'var message = "Hello World"; console.log(message);'
eval(jsString)//Hello World
///
// var message = "Hello World"//Hello World
console.log(message) //eval中声明的变量可以被下文使用


```



## 严格模式

严格模式对正常的JavaScript语义进行了一些限制:

- 严格模式通过 **抛出错误** 来消除一些原有的 **静默(silent)错误;**
- 严格模式让JS引擎在执行代码时可以进行更多的优化(不需要对一些特殊的语法进行处理);
- 严格模式禁用了在ECMAScript未来版本中可能会定义的一些语法;

**开启严格模式**

在文件或者函数开头使用**`' use strict '`**来开启。

- 可以支持在js文件中开启严格模式;
- 也支持对某一个函数开启严格模式;

**限制**

1. 无法意外的创建全局变量
2. 严格模式会使引起静默失败(silently fail,注:不报错也没有任何效果)的赋值操作抛出异常
3. 严格模式下试图删除不可删除的属性
4. 严格模式不允许函数参数有相同的名称
5. 不允许0的八进制语法
6. 不允许使用with
7. eval不再为上层引用变量
8. **this绑定不会默认转成对象**
   - **自执行函数this指向undefined**

```js
"use strict"
// 1. 禁止意外创建全局变量
message = "Hello World"
console.log(message)

function foo() {
  age = 20
}

foo()
console.log(age)

// 2.不允许函数有相同的参数名称
function foo(x, y, x) {
  console.log(x, y, x)
}

foo(10, 20, 30)

// 3.静默错误
true.name = "abc"
NaN = 123
var obj = {}
//--
Object.defineProperty(obj, "name", {
  configurable: false,//是否可配置 (不能被删除)
  writable: false,//是否可写
  value: "why"
})
console.log(obj.name)
obj.name = "kobe" 

delete obj.name

//4.不允许使用原先的八进制格式 0123 以0开头

//es6表示
var num = 0o123 // 八进制
var num2 = 0x123 // 十六进制
var num3 = 0b100 // 二进制
console.log(num, num2, num3)

//5.with语句不允许使用

// 6.eval函数不会向上引用变量了
var jsString = '"use strict"; var message = "Hello World"; console.log(message);'
eval(jsString)
console.log(message)
```



```js
"use strict"

// 在严格模式下, 自执行函数(默认绑定)会指向undefined
// 之前编写的代码中, 自执行函数我们是没有使用过this直接去引用window
function foo() {
  console.log(this)
}

var obj = {
  name: "why",
  foo: foo
}

foo()

obj.foo()
var bar = obj.foo
bar()


// setTimeout的this
// fn.apply(this = window)
setTimeout(function() { //setTimeout交给浏览器执行,外界看是个黑盒 想成fn.apply(window)
  console.log(this)
}, 1000);
setTimeout(()=> {//箭头函数this直接指向外层作用域window
  console.log(this)
}, 1000);

```

