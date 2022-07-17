# 12_async/await_事件循环

# 异步函数 async function

async关键字用于声明一个异步函数:

```ts
// await/async
async function foo1() {
}

const foo2 = async () => {
}

class Foo {
  async bar() {
  }
}
```

## 执行流程

异步函数的内部代码执行过程和普通的函数是一致的，默认情况下也是会被同步执行。

异步函数有返回值时，和普通函数会有区别:

- 情况一:异步函数也可以有返回值，但是**异步函数的返回值会被包裹到Promise.resolve中;**
- 情况二:如果我们的异步函数的**返回值是Promise**，**Promise.resolve的状态会由Promise决定;**
- 情况三:如果我们的异步函数的返回值是一个对象并且实现**了thenable**，那么会**由对象的then方法来决定;**



```ts
async function foo() {
  console.log("foo function start~")

  console.log("中间代码~")

  console.log("foo function end~")

  // 1.返回一个值
	// return '123'
  
  // 2.返回thenable
  // return {
  //   then: function(resolve, reject) {
  //     resolve("hahahah")
  //   }
  // }

  // 3.返回Promise
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hehehehe")
    }, 2000)
  })
}

// 异步函数的返回值一定是一个Promise
const promise = foo()
promise.then(res => {
  console.log("promise then function exec:", res)
})

```

**在async中抛出了异常**，那么程序它并不会像普通函数一样报错，而是会作为**Promise的reject来传递**

```ts
async function foo() {
  console.log("foo function start~")

  console.log("中间代码~")

  // 异步函数中的异常, 会被作为异步函数返回的Promise的reject值的
  throw new Error("error message")

  console.log("foo function end~")
}

// 异步函数的返回值一定是一个Promise
foo().catch(err => {
  console.log(" err:", err)
})

console.log("后续还有代码~~~~~")

```

## await关键字

 async函数另外一个特殊之处就是**可以在它内部使用await关键字**，而普通函数中是不可以的。

- 
  通常使用await是后面会跟上一个表达式，这个表达式会返回一个Promise
- 那么**await会等到Promise的状态变成fulfilled状态**，之后继续执行异步函数;

- 如果await后面是一个**普通的值，那么会直接返回这个值;**
- 如果await后面是一个thenable的对象，那么会**根据对象的then方法调用来决定后续的值;**
- 如果await后面的表达式，**返回的Promise是reject的状态，那么会将这个reject结果直接作为函数的Promise的 reject值;**

```ts
// 1.await+表达式
function requestData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success')//resolve
    }, 2000)
  })
}

// 2.跟上其他的值
async function foo() {
  // const res1 = await 123
  // const res1 = await {
  //   then: function(resolve, reject) {
  //     resolve("abc")
  //   }
  // }
  const res1 = await new Promise((resolve) => {
    resolve("pithy")
  })
  console.log("res1:", res1)
}
```

```ts
// 1.await+表达式
function requestData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('success')
    }, 2000)
  })
}
// 3.reject值
async function foo() {
  const res1 = await requestData()
  console.log("res1:", res1)
}

foo().catch((err) => {
  console.log("err:", err)
})
```

# 事件循环

## 浏览器中的JavaScript线程

**JavaScript是单线程**的，但是**JavaScript的线程应该有自己的容器进程**:浏览器或者Node。

**浏览器是一个进程吗，它里面只有一个线程吗?**

- 目前多数的浏览器其实都是多进程的，当我们**打开一个tab页面时就会开启一个新的进程**，这是为了防止一个页面卡死而造成所有页面无法响应，整个浏览器需要强制退出;
- **每个进程中又有很多的线程，其中包括执行JavaScript代码的线程;**

**JavaScript的代码执行是在一个单独的线程中执行的:**

- 这就意味着JavaScript的代码，**在同一个时刻只能做一件事**
- 如果这件事是非常耗时的，就意味着当前的线程就会被阻塞;

**真正耗时的操作，实际上并不是由JavaScript线程在执行的:**

- 浏览器的每个进程是多线程的，那么其他线程可以来完成这个耗时的操作
- 比如**网络请求、定时器**，我们只需要在特性的时候**执行应该有的回调**

## 浏览器的事件循环

如果在执行JavaScript代码的过程中，有异步操作

例如中间插入了一个setTimeout的函数调用;

- 这个**函数被放到入调用栈**，**执行会立即结束**，**不会阻塞后续代码的执行**;

![image-20220717094706801](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207170947837.png)

## 宏任务和微任务

事件循环中并非只维护着一个队列，事实上是有两个队列:

- **宏任务队列**(macrotask queue):ajax、setTimeout、setInterval、DOM监听、UI Rendering等
- **微任务队列**(microtask queue):Promise的then回调、 Mutation Observer API、queueMicrotask()等

事件循环中两个队列的优先级

- main script中的代码优先执行(编写的**顶层script代码**);
- 在执行任何一个宏任务之前(不是队列，是一个宏任务)，都会先查看微任务队列中是否有任务需要执行
- **也就是宏任务执行之前，必须保证微任务队列是空的;**
- **如果不为空，那么就优先执行微任务队列中的任务(回调);**