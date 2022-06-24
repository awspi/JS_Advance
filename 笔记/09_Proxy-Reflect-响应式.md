# 09_Proxy-Reflect-响应式

# 监听对象的操作

**我们先来看一个需求:有一个对象，我们希望监听这个对象中的属性被设置或获取的过程**

## Object.defineProperty

```js
const obj ={
  name:'pithy',
  age:22
}

Object.keys(obj).forEach((key)=>{
  let value=obj[key]
  Object.defineProperty(obj,key,{
    get:function(){
      console.log(`监听obj对象的${key}属性被访问 `);
      return value
    },
    set:function(newVal){
      console.log(`监听到obj对象的${key}属性被赋值 `);
      value=newVal
    }
  })
})
obj.name='awspi'
obj.age=18
console.log(obj.age);
```

**缺点**

- 首先，Object.defineProperty设计的初衷，不是为了去监听截止一个对象中所有的属性的。
- 我们在定义某些属性的时候，初衷其实是定义普通的属性，但是后面我们强 行将它变成了数据属性描述符。
- 其次，如果我们想监听更加丰富的操作，比如新增属性、删除属性，那么 Object.defineProperty是无能为力的。
- 所以我们要知道，存储数据描述符设计的初衷并不是为了去监听一个完整的对象。

# Proxy

在ES6中，新增了一个**Proxy类**，这个类从名字就可以看出来，是用于帮助我们创建一个**代理**的:

- 如果我们希望**监听一个对象的相关操作**，那么我们可以**先创建一个代理对象(Proxy对象)**
- 之后**对该对象的所有操作，都通过代理对象来完成**，**代理对象可以监听我们想要对原对象进行哪些操作;**





## Proxy的set和get捕获器

如果我们想要侦听某些具体的操作，那么就可以在handler中添加对应的捕捉器(Trap):

set和get分别对应的是函数类型; 

set函数有四个参数:

- target:目标对象(侦听的对象);
- property:将被设置的属性key;
- value:新属性值;
- receiver:调用的代理对象;

get函数有三个参数:

- target:目标对象(侦听的对象)
- property:被获取的属性key;
- receiver:调用的代理对象;



> 上面的案例用Proxy来实现一次:
>
> - 首先，我们需要new Proxy对象，并且传入需要侦听的对象以及一个处理对象，可以称之为handler;
>   - const p = new Proxy(target, handler)
> - 其次，我们之后的操作都是直接对Proxy的操作，而不是原有的对象，因为我们需要在handler里面进行侦听;
>
> ```js
> const obj ={
>   name:'pithy',
>   age:22
> }
> 
> const ObjProxy=new Proxy(obj,{
>   get:function(target,key){
>     console.log(`监听到对象的${key}属性被访问 `,target);
>     return target[key]
>   },
>   set:function(target,key,newVal){
>     console.log(`监听到对象的${key}属性被赋值 `,target);
>     target[key]=newVal
>   }
> 
> })
> console.log(ObjProxy.name)
> console.log(ObjProxy.age)
> 
> ObjProxy.name='awspi'
> ObjProxy.age=12
> 
> console.log(obj.name)
> console.log(obj.age)
> ```
>
> 

## in和deleteProperty捕获器

```js
const obj ={
  name:'pithy',
  age:22
}

const ObjProxy=new Proxy(obj,{
  get:function(target,key){
    console.log(`监听到对象的${key}属性被访问 `,target);
    return target[key]
  },

  set:function(target,key,newVal){
    console.log(`监听到对象的${key}属性被赋值 `,target);
    target[key]=newVal
  },

  //监听in到捕获器
  has:function(target,key){
    console.log(`监听到对象的${key}属性in操作 `,target);
    return key in target
  },
  //监听del到捕获器
  deleteProperty:function(target,key){
    console.log(`监听到对象的${key}属性del操作 `,target);
    delete target[key]
  },
})

// in操作符
console.log("name" in ObjProxy)//监听到对象的name属性in操作  { name: 'pithy', age: 22 }

// delete操作
delete ObjProxy.name//监听到对象的name属性del操作  { name: 'pithy', age: 22 }

```

## 函数对象的construct和apply

```js
function foo(){}

const fooProxy=new Proxy(foo,{
  apply:function(target,thisArg,argArray){
    console.log('对foo函数进行了apply调用');
    target.apply(thisArg,argArray)
  },
  construct:function(target,argArray,newTarget){
    console.log('对foo函数进行了new调用');
    return new target(...argArray)
  }
})

fooProxy.apply({},['a','b'])//对foo函数进行了apply调用
new fooProxy('d','e')//对foo函数进行了new调用
```



## Proxy所有捕获器

- **handler.has()**
  - **in 操作符的捕捉器。**
- **handler.get()**
  - **属性读取操作的捕捉器。**
- **handler.set()**
  - **属性设置操作的捕捉器。**
- **handler.deleteProperty() p**
  - **delete 操作符的捕捉器。**
- **handler.apply()**
  - **函数调用操作的捕捉器。**
- **handler.construct()**
  - **new 操作符的捕捉器。**



- handler.getPrototypeOf()
  - Object.getPrototypeOf 方法的捕捉器。
- handler.setPrototypeOf()
  - Object.setPrototypeOf 方法的捕捉器。
- handler.isExtensible()
  - Object.isExtensible 方法的捕捉器。
- handler.preventExtensions()
  - Object.preventExtensions 方法的捕捉器。
- handler.getOwnPropertyDescriptor()
  - Object.getOwnPropertyDescriptor 方法的捕捉器。
- handler.defineProperty()
  - Object.defineProperty 方法的捕捉器。

- handler.ownKeys()
  - Object.getOwnPropertyNames 方法和Object.getOwnPropertySymbols 方法的捕捉器。

# Reflect

Reflect也是ES6新增的一个API，它是**一个对象**，字面的意思是**反射**。

- 提供了很多操作JavaScript对象的方法，有点像Object中操作对象的方法;
  - 比如Reflect.getPrototypeOf(target)类似于 Object.getPrototypeOf();
  - 比如Reflect.defineProperty(target, propertyKey, attributes)类似于Object.defineProperty() ;

- 在早期的ECMA规范中没有考虑到这种对 **对象本身** 的操作如何设计会更加规范，所以将这些API放到了Object上面;

  - 但是Object作为一个构造函数，这些操作实际上放到它身上并不合适;

  - 另外还包含一些类似于 in、delete操作符，让JS看起来是会有一些奇怪的;

  - 所以**在ES6中新增了Reflect，让我们这些操作都集中到了Reflect对象上;**

> Object和Reflect对象之间的API关系:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods



## Reflect的常见方法

Reflect中有哪些常见的方法呢?它和Proxy是一一对应的，也是13个: 

- Reflect.getPrototypeOf(target)
  - 类似于 Object.getPrototypeOf()。
- Reflect.setPrototypeOf(target, prototype)
  - 设置对象原型的函数. 返回一个 Boolean， 如果更新成功，则返 回true。
- Reflect.isExtensible(target)
  - 类似于 Object.isExtensible()
- Reflect.preventExtensions(target)
  - 类似于 Object.preventExtensions()。返回一个Boolean。
- Reflect.getOwnPropertyDescriptor(target, propertyKey)
  - 类似于 Object.getOwnPropertyDescriptor()。如果对象中存在该属性，则返回对应的属性描述符, 否则返回 undefined.
- Reflect.defineProperty(target, propertyKey, attributes)
  - 和 Object.defineProperty() 类似。如果设置成功就会返回 true

- Reflect.ownKeys(target)
  - 返回一个包含所有自身属性(不包含继承属性)的数组。(类似于Object.keys(), 但不会受enumerable影响). 
- Reflect.has(target, propertyKey)
  - 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。
- Reflect.get(target, propertyKey[, receiver])
  - 获取对象身上某个属性的值，类似于 target[name]。 
- Reflect.set(target, propertyKey, value[, receiver])
  - 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
- Reflect.deleteProperty(target, propertyKey)
  - 作为函数的delete操作符，相当于执行 delete target[name]。
- Reflect.apply(target, thisArgument, argumentsList)
  - 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.prototype.apply() 功能类似。
- Reflect.construct(target, argumentsList[, newTarget])
  - 对构造函数进行 new 操作，相当于执行 new target(...args)。

## 和Proxy结合使用

返回值为boolen 是否成功

```js
const obj ={
  name:'pithy',
  age:22
}

const ObjProxy=new Proxy(obj,{
  get:function(target,key){
    console.log(`监听到对象的${key}属性被访问 `,target);
    return Reflect.get(target,key)
  },
  set:function(target,key,newVal){
    console.log(`监听到对象的${key}属性被赋值 `,target);
    Reflect.set(target,key,newVal)
  }
})
console.log(ObjProxy.name)
console.log(ObjProxy.age)
ObjProxy.name='awspi'
ObjProxy.age=12


console.log(obj.age)
```

## Receiver参数

在使用getter、setter的时候有一个receiver的参数，它的作用是什么呢?

如果我们的源对象(obj)有setter、getter的访问器属性，那么**可以通过receiver来改变里面的this;**

```js
const obj={
  _name:'pithy',
  get name(){
    return this._name
  },
  set name(newVal){
    this._name=newVal//this指向obj 不是objProxy
  }
}

const objProxy=new Proxy(obj,{
  get:function(target,key,receiver){
    //receiver是创建出来的代理对象
    console.log(`监听到对象的${key}属性被访问 `,target,receiver);
    return Reflect.get(target,key,receiver)
  },
  set:function(target,key,newVal,receiver
    ){
    console.log(`监听到对象的${key}属性被赋值 `,target);
    Reflect.set(target,key,newVal,receiver)
  }
})

objProxy.name='awspi'
console.log(objProxy.name);
```

![image-20220625031252897](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206250312922.png)



## Reflect的construct

`construct(target: Function, argumentsList: ArrayLike<any>, **newTarget?: Function | undefined)`

Constructs the target with the elements of specified array as the arguments and the specified constructor as the `new.target` value.

```js
function Student(name,age){
  this.name=name,
  this.age=age
}
function Teacher(){}

//执行Student函数里的内容,但是创建出来的是Teacher对象
const teacher=Reflect.construct(Student,['why',18],Teacher)
console.log(teacher);
console.log(teacher.__proto__===Teacher.prototype);//true
```

