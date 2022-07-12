# 10_Promise

Promise是一个类，可以翻译成 承诺、许诺 、期约;

当我们需要给予调用者一个承诺:待会儿我会给你回调数据时，就可以创建一个Promise的对象

- 在通过new创建Promise对象时，我们需要传入一个回调函数，我们称之为executor,这个回调函数会被立即执行，

并且给传入另外两个回调函数**`resolve`**、**`reject`**;

- 当我们调用resolve回调函数时，会执行Promise对象的then方法传入的回调函数
- 当我们调用reject回调函数时，会执行Promise对象的catch方法传入的回调函数

```js
function foo(){
  return new Promise((resolve,reject)=>{////executor
    // resolve() 
    // reject()
  })
}

const fooPromise=foo()
// then方法传入的回调函数两个回调函数:
// > 第一个回调函数, 会在Promise执行resolve函数时, 被回调
// > 第二个回调函数, 会在Promise执行reject函数时, 被回调
fooPromise.then(()=>{
//success
},()=>{
//fail
})
```

![image-20220625205357942](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252053995.png)

![image-20220625210010870](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252100912.png)

## **Promise的代码结构**

### 状态

Promise使用过程可以划分成三个状态:

待定(**pending**): 初始状态，既没有被兑现，也没有被拒绝;

- 当执行executor中的代码时，处于该状态

已兑现(**fulfilled**): 意味着操作成功完成;

- 执行了resolve时，处于该状态;

已拒绝(**rejected**): 意味着操作失败;

- 执行了reject时，处于该状态;



### Executor

通常我们会在Executor中确定我们的Promise状态:

- 通过resolve，可以兑现(fulfilled)Promise的状态，
- 通过reject，可以拒绝(reject)Promise的状态;

**注意**:**一旦状态被确定下来，Promise的状态会被锁死**，该Promise的状态是不可更改的

在我们调用resolve的时候，**如果resolve传入的值本身不是一个Promise，那么会将该Promise的状态变成兑现(fulfilled);**

在之后我们去调用reject时，无法改变Promise状态  *(先reject后resolve同理)*

### resolve()的参数

 * 普通值或者对象  pending -> fulfilled
 * 传入一个Promise
   * 那么当前的Promise的状态会**由传入的Promise来决定** 相当于**状态进行了移交**
 * 传入一个对象, 并且这个对象**有实现then方法(并且这个对象是实现了thenable接口)**
   * 那么也会执行该then方法, 并且**由该then方法决定后续状态**

![image-20220625210939431](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252109463.png)



## then方法

```js
在.then中传入第二个参数相当于catch的回调
promise.then(res => {

}, err => {
  console.log("err:", err)
})
```



### 多次调用

一个Promise的then方法是可以被多次调用的:

- 每次调用我们都可以传入对应的fulfilled回调;
- 当Promise的状态变成fulfilled的时候，**这些回调函数都会被执行;**

![image-20220625223136633](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252231693.png)

### 返回值

then方法本身是有返回值的，它的返回值是一个Promise，所以我们可以进行链式调用:

<img src="https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252241882.png" alt="image-20220625224120835" style="zoom:67%;" />

```js
// 1> 如果我们返回的是一个普通值(数值/字符串/普通对象/undefined), 那么这个普通的值被作为一个新的Promise的resolve值
promise.then(res => {
  return "aaaaaa"
}).then(()=>{
  console.log("promise.then.then")
})
promise.then(res => {
  return "aaaaaa"
}).then(res => {
  console.log("res:", res)
  return "bbbbbb"
})
```

![image-20220625223642563](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252236609.png)

```js
// 2> 如果我们返回的是一个Promise 相当于resolve(返回的Promise)
promise.then(res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(111111)
    }, 3000)
  })
}).then(res => {
  console.log("res:", res)
})
```

```js
// 3> 如果返回的是一个对象, 并且该对象实现了thenable
//相当于resolve(obj.then)
promise.then(res => {
  return {
    then: function(resolve, reject) {
      resolve(222222)
    }
  }
}).then(res => {
  console.log("res:", res)
})
```

## catch方法

catch方法也是Promise对象上的一个方法:它也是放在Promise的原型上的 Promise.prototype.catch

### 多次调用

一个Promise的catch方法是可以被多次调用的:

- 每次调用我们都可以传入对应的reject回调;
- 当Promise的状态变成reject的时候，**这些回调函数都会被执行;**

```js
const promise = new Promise((resolve, reject) => {
  // resolve()
  // reject("rejected status")
  throw new Error("rejected status")
})

// 1.当executor抛出异常时, 也是会调用错误(拒绝)捕获的回调函数的
promise.then(undefined, err => {
  console.log("err:", err)
  console.log("----------")
})
//promise/a+规范
promise.catch(err => {
  console.log("err:", err)
})
```

#### promise.then().catch()

![image-20220625230102794](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252301832.png)

```js
promise.then(res => {
  return new Promise((resolve, reject) => {
    reject("then rejected status")
  })
  // throw new Error("error message")
}).catch(err => {
  console.log("err:", err) //err: then rejected status
})
```



####  拒绝捕获

![Snipaste_2022-06-25_23-08-57](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252309077.png)



### 返回值

catch方法也是会返回一个Promise对象的，所以catch方法后面我们可以继续调用then方法或者catch方法:

- catch传入的回调在执行完后，默认状态依然会是fulfilled的;
- 如果我们希望后续继续执行catch，那么需要抛出一个异常:

```js
// 4.catch方法的返回值
const promise = new Promise((resolve, reject) => {
  reject("111111")
})
//res result: catch return value
promise.then(res => {
  console.log("res:", res)
}).catch(err => {
  console.log("err:", err)
  return "catch return value"
}).then(res => {
  console.log("res result:", res)
}).catch(err => {
  console.log("err result:", err)
})

```



## finally方法

表示无论Promise对象无论变成fulfilled还是reject状态，最终都会 被执行的代码。

finally方法是不接收参数的，因为无论前面是fulfilled状态，还是reject状态，它都会执行。

```js
const promise = new Promise((resolve, reject) => {
  // resolve("resolve message")
  reject("reject message")
})

promise.then(res => {
  console.log("res:", res)
}).catch(err => {
  console.log("err:", err)
}).finally(() => {
  console.log("finally code execute")
})

```



# 类方法

## resolve方法

有时候我们已经有一个现成的内容了，希望将其转成Promise来使用

**Promise.resolve的用法相当于new Promise，并且执行resolve操作:**

```js
// 转成Promise对象
function foo() {
  const obj = { name: "why" }
  return new Promise((resolve) => {
    resolve(obj)
  })
}


```

**resolve参数**

- 参数是一个普通的值或者对象
- 参数本身是Promise
- 参数是一个thenable

```js
// 类方法Promise.resolve
// 1.普通的值
const promise = Promise.resolve({ name: "why" })
// 相当于
const promise2 = new Promise((resolve, reject) => {
  resolve({ name: "why" })
})
```

```js
// 2.传入Promise
const promise = Promise.resolve(new Promise((resolve, reject) => {
  resolve("11111")//状态进行了移交
}))

```

## reject方法

reject方法类似于resolve方法，只是会将Promise对象的状态**设置为reject状态。** 

- 设置为reject状态 promise就锁定无法改变了,直接进入reject

**Promise.reject的用法相当于new Promise，只是会调用reject:**

Promise.reject**传入的参数无论是什么形态**，都会**直接**作为reject状态的**参数**传递到**catch**的。



## all方法

Promise.all:

它的作用是将多个Promise包裹在一起形成一个新的Promise

新的Promise状态由包裹的所有Promise共同决定:

- 当所有的Promise状态变成fulfilled状态时，新的Promise状态为fulfilled，并且会**将所有Promise的返回值组成一个数组**;
- 当有一个Promise状态为reject时，新的Promise状态为reject，并且会**将第一个reject的返回值作为参数;**

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(11111)
  }, 1000);
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // reject(22222)
    resolve(22222)
  }, 2000);
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(33333)
  }, 3000);
})

// 需求: 所有的Promise都变成fulfilled时, 再拿到结果
// 意外: 在拿到所有结果之前, 有一个promise变成了rejected, 那么整个promise是rejected
Promise.all([p2, p1, p3 ]).then(res => { 
  console.log(res)//[ 22222, 11111, 33333 ] 安装数组顺序而不是返回的数据
}).catch(err => {
  console.log("err:", err)
})

```



## allSettled方法

all方法有一个缺陷:当有其中一个Promise变成reject状态时，新Promise就会立即变成对应的reject状态。

那么对于resolved的，以及依然处于pending状态的Promise，我们是获取不到对应的结果的;

ES11(ES2020)中，添加了新的API Promise.allSettled:

该方法会在所有的Promise都有结果(settled)，无论是fulfilled，还是reject时，才会有最终的状态; 

并且**这个Promise的结果一定是fulfilled的;**

allSettled的结果是一个数组，数组中存放着每一个Promise的结果，并且是对应一个对象的

- 这个对象中包含status状态，以及对应的value值;

![image-20220625235705197](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202206252357246.png)

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(11111)
  }, 1000);
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(22222)
  }, 2000);
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(33333)
  }, 3000);
})

// allSettled
Promise.allSettled([p1, p2, p3]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

```



## race方法

 如果有一个Promise有了结果(fullfilled)，我们就希望决定最终新Promise的状态，那么可以使用race方法: 

- 多个Promise相互竞争，谁先有结果，那么就使用谁的结果;
- 如果在有一个Promise有了结果(fullfilled)之前,先返回一个Promise状态为reject时，新的Promise状态为reject，并且会**将第一个reject的返回值作为参数;**

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(11111)
  }, 3000);
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(22222)
  }, 500);
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(33333)
  }, 1000);
})

// race: 竞技/竞赛
// 只要有一个Promise变成fulfilled状态, 那么就结束
// 意外: 
Promise.race([p1, p2, p3]).then(res => {
  console.log("res:", res)
}).catch(err => {
  console.log("err:", err)
})

```

## any方法

any方法是ES12中新增的方法，和race方法是类似的:

any方法会等到一个**fulfilled**状态，才会决定新Promise的状态(状态fullfilled和resovle参数)

如果**所有的Promise都是reject的**，那么也会**等到所有的Promise都变成rejected状态**

- 如果所有的Promise都是reject的，那么会报一个AggregateError的错误。

​	

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(11111)
    reject(1111)
  }, 1000);
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(22222)
  }, 500);
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(33333)
    reject(3333)
  }, 3000);
})

// any方法
Promise.any([p1, p2, p3]).then(res => {
  console.log("res:", res)
}).catch(err => {
  console.log("err:", err.errors)
})

```



# 实现promise

简单实现

```
// ES6 ES2015
// https://promisesaplus.com/
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

class myPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          this.onFulfilledFns.forEach(fn => {
            fn(this.value)
          })
        });
      }
    }

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          this.onRejectedFns.forEach(fn => {
            fn(this.reason)
          })
        })
      }
    }

    executor(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    // 1.如果在then调用的时候, 状态已经确定下来
    if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
      onFulfilled(this.value)
    }
    if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
      onRejected(this.reason)
    }

    // 2.将成功回调和失败的回调放到数组中
    if (this.status === PROMISE_STATUS_PENDING) {
      this.onFulfilledFns.push(onFulfilled)
      this.onRejectedFns.push(onRejected)
    }
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  resolve(1111) // resolved/fulfilled
  reject(2222)
})

// 调用then方法多次调用
promise.then(res => {
  console.log("res1:", res)
}, err => {
  console.log("err:", err)
})

promise.then(res => {
  console.log("res2:", res)
}, err => {
  console.log("err2:", err)
})

// const promise = new Promise((resolve, reject) => {
//   resolve("aaaaa")
// })

// 在确定Promise状态之后, 再次调用then
setTimeout(() => {
  promise.then(res => {
    console.log("res3:", res)
  }, err => {
    console.log("err3:", err)
  })
}, 1000)


```



## 更复杂逻辑看js高级视频20-

