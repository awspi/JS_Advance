# 12_async/await_事件循环

> 视频p23 

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

# 事件循环EventLoop

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

### 宏任务和微任务

事件循环中并非只维护着一个队列，事实上是有**两个队列:**

- **宏任务队列**(macrotask queue):**ajax、setTimeout、setInterval、DOM监听、UI Rendering等**
- **微任务队列**(microtask queue):**Promise的then回调、 Mutation Observer API、queueMicrotask()等**

### 🏷️事件循环队列的优先级

- **main script中的代码优先执行**(编写的**顶层script代码**);
- 在执行任何一个宏任务之前(不是队列，是一个宏任务)，都会先查看微任务队列中是否有任务需要执行
- **也就是宏任务执行之前，必须保证微任务队列是空的;**
- **如果不为空，那么就优先执行微任务队列中的任务(回调);**



## Node的事件循环

浏览器中的EventLoop是根据HTML5定义的规范来实现的，不同的浏览器可能会有不同的实现，而Node中是由 libuv实现的

libuv中主要维护了一个EventLoop和worker threads(线程池);

EventLoop负责调用系统的一些其他操作:文件的IO、Network、child-processes等

![image-20220717112258552](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207171122594.png)

事件循环像是一个桥梁，是连接着应用程序的**JavaScript**和**系统调用**之间的通道:

- 无论是文件IO、数据库、网络IO、定时器、子进程，在完成对应的操作后，都会**将对应的结果和回调函数放到事件循环(任务队列)**
- 事件循环会不断的从任务队列中取出对应的事件(回调函数)来执行;

**一次完整的事件循环Tick分成很多个阶段:**

- **定时器(Timers)**:本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
- **待定回调(Pending Callback)**:对某些系统操作(如TCP错误类型)执行回调，比如TCP连接时接收到 ECONNREFUSED。
- **idle, prepare**:仅系统内部使用。
- **轮询(Poll)**:检索新的 I/O 事件;执行与 I/O 相关的回调; p检测(check):setImmediate() 回调函数在这里执行
- **关闭的回调函数**:一些关闭的回调函数，如:socket.on('close', ...)。

### Node的宏任务和微任务

从一次事件循环的Tick来说，Node的事件循环更复杂，它也分为微任务和宏任务:

- 宏任务(macrotask):setTimeout、setInterval、IO事件、setImmediate、close事件
- 微任务(microtask):Promise的then回调、process.nextTick、queueMicrotask;

**但是Node中的事件循环不只是 微任务队列和 宏任务队列:**

微任务队列:

- next tick queue:**process.nextTick;**
- other queue:**Promise的then回调、queueMicrotask**

宏任务队列:

- timer queue:**setTimeout、setInterval**
- poll queue:**IO事件;**
- check queue:**setImmediate;**
- close queue:**close事件;**

**Node事件循环的顺序**

在每一次事件循环的tick中，会按照如下顺序来执行代码: 

1. next tick microtask queue;
2. other microtask queue;
3. timer queue;
4. poll queue; 
5. check queue; 
6. close queue;



# 事件循环面试题

画图解, main script 、微任务、宏任务



## 浏览器

### Promise

```ts
setTimeout(function () {
  console.log("setTimeout1");
  new Promise(function (resolve) {
    resolve();
  }).then(function () {
    new Promise(function (resolve) {
      resolve();
    }).then(function () {
      console.log("then4");
    });
    console.log("then2");
  });
});

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("then1");
});

setTimeout(function () {
  console.log("setTimeout2");
});

console.log(2);

queueMicrotask(() => {
  console.log("queueMicrotask1")
});

new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("then3");
});

// promise1
// 2
// then1
// queueMicrotask1
// then3
// setTimeout1
// then2
// then4
// setTimeout2

```

### promise async await

```ts
async function async1 () {
  console.log('async1 start')
  await async2();
  console.log('async1 end')
}

async function async2 () {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)
 
async1();
 
new Promise (function (resolve) {
  console.log('promise1')
  resolve();
}).then (function () {
  console.log('promise2')
})

console.log('script end')

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout

```

```ts
async function bar() {
  console.log("2222")
  return new Promise((resolve) => {
    resolve()
  })
}

async function foo() {//async函数默认会立即执行
  console.log("1111")
  await bar()
  console.log("3333")//相当于在await返回的then方法中,会放入微队列
}

foo()
console.log("4444")
//1111
//2222
//4444
//3333
```

```ts
async function async1() {
  console.log("async1 start")
  await async2()
  console.log("async1 end")
}

async function async2() {
  console.log("async2")
}

console.log("script start")

setTimeout(function () {
  console.log("setTimeout")
}, 0)

async1() 

new Promise(function (resolve) {
  console.log("promise1")
  resolve()
}).then(function () {
  console.log("promise2")
})

console.log("script end")
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout


```



### Promise较难

```ts
Promise.resolve()
  .then(() => {
    console.log(0)
    // 1.直接return一个值 相当于resolve(4)
    // return 4

    // 2.return thenable的值 多加一次微任务
    return {
      then: function (resolve) {
        // 大量的计算
        resolve(4)
      },
    }

    // 3.return Promise
    // 不是普通的值, 多加一次微任务
    // Promise.resolve(4), 多加一次微任务
    // 一共多加两次微任务
    return Promise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })

Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(5)
  })
  .then(() => {
    console.log(6)
  })

// 1.return 4
// 0
// 1
// 4
// 2
// 3
// 5
// 6

// 2.return thenable
// 0
// 1
// 2
// 4
// 3
// 5
// 6

// 3.return promise
// 0
// 1
// 2
// 3
// 4
// 5
// 6

```

## Node

```
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout0')
}, 0)

setTimeout(function () {
  console.log('setTimeout2')
}, 300)

setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick1'));

async1();

process.nextTick(() => console.log('nextTick2'));

new Promise(function (resolve) {
  console.log('promise1')
  resolve();
  console.log('promise2')
}).then(function () {
  console.log('promise3')
})

console.log('script end')

// script start
// async1 start
// async2
// promise1
// promise2
// script end
// nexttick1
// nexttick2
// async1 end
// promise3
// settimetout0
// setImmediate
// setTimeout2

```

