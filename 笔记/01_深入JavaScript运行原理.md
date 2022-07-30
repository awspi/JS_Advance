# 01_深入JavaScript运行原理

## xxx

## XXX

## xxx



![image-20220608184456296](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242226580.png)





## JavaScript的执行过程

js引擎会在执行代码之前，会在**堆内存**中创建一个全局对象:**Global Object(GO)** 

- 该对象 所有的**作用域(scope)**都可以访问; 
- 里面会包含**Date、Array、String、Number、setTimeout、setInterval**等等; 
- 其中还有一个**window属性**指向自己;

![image-20220608183002569](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242226925.png)



### 全局代码执行过程

example

```js
var name = "why"

console.log(num1)

var num1 = 20
var num2 = 30
var result = num1 + num2

console.log(result)
```

![image-20220608184855421](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242226919.png)

会经历以下步骤

1. 代码被解析, v8引擎内部会帮助我们创建一个对象(GlobalObject -> go)

   ```js
   var globalObject = {
     String: "类",
     Date: "类",
     setTimeount: "函数",
     window: globalObject,
     name: undefined,
     num1: undefined,
     num2: undefined,
     result: undefined
   }
   ```

   

2. 运行代码

   1. v8为了执行代码,v8引擎内部有一个**执行上下文栈(函数调用栈)**(Execution Context Stack, **ECStack**),用于执行**代码的调用栈**
   2. 因为我们执行的是全局代码, 为了全局代码能够正常的执行, 需要创建 **全局执行上下文**(**Global Execution Context**)(全局代码需要被执行时才会创建)
   3. **GEC**会 被放入到**ECS**中 执行;

**GEC被放入到ECS中里面包含两部分内容:** 

1. **第一部分:**在代码执行前，在parser转成AST的过程中，会将***全局定义的变量、函数等***加入到GlobalObject中，但是**并不会赋值**;
   - 这个过程也称之为**变量的作用域提升(hoisting)**
2. **第二部分:**在代码执行中，对变量赋值，或者执行其他的函数;

![image-20220608184319882](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242226885.png)



### 遇到函数如何执行

在执行的过程中**执行到一个函数时**，就会根据**函数体**创建一个**函数执行上下文(Functional Execution Context，简称FEC)**，并且压入到**EC Stack中。**

FEC中包含三部分内容:

![image-20220608200114358](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242226188.png)

1. 第一部分:在解析函数成为AST树结构时，会创建一个**Activation Object(AO**):
   - AO中包含**形参、arguments、函数定义和指向函数对象、定义的变量**;
2. 第二部分:**作用域链**: 由**VO**(在函数中就是AO对象)和**父级VO**组成，**查找时会一层层查找**; 
3. 第三部分:this绑定的值



**FEC被放入到ECS中**

![image-20220608202512234](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242227461.png)


**FEC开始执行代码**

![image-20220608202432418](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242227604.png)

example

```js
foo(123)
function foo(num) {
  console.log(m)
  var m = 10
  var n = 20

  console.log(name)
}
```

![image-20220608195741019](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242227330.png)



### 函数嵌套

example

```js
foo(123)
function foo(num) {
  console.log(m)//undefined
  var m = 10
  var n = 20

  function bar() {
    //console.log(name)
  }

  bar()
}
```

![image-20220608202930110](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242227492.png)

### 函数调用函数

example

```js
var message = "Hello Global"

function foo() {
  console.log(message)//Hello Global
}

function bar() {
  var message = "Hello Bar"
  foo()
}

bar()
```

![image-20220608204743848](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206242227792.png)



## 变量环境和记录

基于早期ECMA的版本规范(ES5之前):

> Every execution context has associated with it a variable object. Variables and functions declared in the source text are added as properties of the variable object. For function code, parameters are added as properties of the variable object.
> **每一个执行上下文会被关联到一个变量环境(variable object, VO)，在源代码中的变量和函数声明会被作为属性添加到VO中。**
> **对于函数来说，参数也会被添加到VO中。**

在最新的ECMA的版本规范中,对于一些词汇 进行了修改:

> Every execution context has an associated VariableEnvironment. Variables and functions declared in ECMAScript code evaluated in an execution context are added as bindings in that VariableEnvironment's Environment Record. For function code, parameters are also added as bindings to that Environment Record.
> **每一个执行上下文会关联到一个变量环境(VariableEnvironment) 中，在执行代码中变量和函数的声明会作为环境记录(Environment Record)添加到变量环境中。对于函数来说，参数也会被作为环境记录添加到变量环境中。**



## 作用域提升面试题





```js
var n=100
function foo(){
  n=200
}
foo()
console.log(n);//200
```

```js
var n=100
//GO:{n:100}
function foo(){
  n=200
//GO:{n:200}
}
foo()
//GO:{n:200}
console.log(n);//200
```

------



```js
function foo(){
  console.log(n)//undefined
  var n=200
  console.log(n)//200
}
var n=100 
foo()
```

```js
function foo(){
	//AO:{n:undefined}
  console.log(n)//undefined
  var n=200
  //AO:{n:200}
  console.log(n)//200
}
var n=100 
//GO:{n:100}
foo()
```

------



```js
var a=100
function foo(){
  console.log(a) //undefined
  return
  var a=100 
}
foo()
```

```js
var a=100
//GO:{a:100 foo:0xa00}
function foo(){
  //AO:{a:undefined}
  console.log(a) //undefined
  return //运行时才会return
  var a=100 //执行不到 AO:{a:100} 但是编译时正常扫描会//AO:{a:undefined} 
}
foo()
```



------



```js
var n=100
function foo1(){
  
  console.log(n);//100
}
function foo2(){
  var n=200
  console.log(n);//200
  foo1()
}
foo2()
console.log(n);//100
```

```js
var n=100
function foo1(){
  //GO:{n:100}
  console.log(n);//100
}
function foo2(){
  var n=200
  //AO:{n:200}
  console.log(n);//200
  foo1()
}
foo2()
//GO:{n:100}
console.log(n);//100
```

------

**作用域补充**

```js
function foo() {
  var m = 100
}

foo()
console.log(m) //ReferenceError: m is not defined
///
function foo() {
  m = 100 // 严格模式下ReferenceError 非严格模式会声明全局变量
}

foo()
console.log(m) //100
```

------



```js
function foo(){
  var a=b=100
}
foo()
console.log(a);//ReferenceError: a is not defined
console.log(b);//100
```

```js
function foo(){
  var a=b=100
  //等价于以下代码
  //var a=100
  //b=100
}
foo()
console.log(a);//ReferenceError: a is not defined
console.log(b);//100
```

#### 🆕函数参数的作用域

![IMG_F376C028A223-1](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207301239456.jpeg)

