# 11_Iterator-Generator

# 迭代器

**迭代器**(iterator)，是确使用户可在容器对象(container，例如链表或数组)上遍访的对象，使用该接口无需关心对象的内部实现细节,其行为像数据库中的光标

在JavaScript中，**迭代器也是一个具体的对象，这个对象需要符合迭代器协议(iterator protocol)**

迭代器协议定义了产生一系列值(无论是有限还是无限个)的标准方式;

- 在js中这个标准就是**一个特定的next方法;**

**next方法有如下的要求:**

**一个无参数或者一个参数**的函数，返回一个应当**拥有以下两个属性**的对象:

**done(boolean)** :是否到最后一个值,迭代完成

- 如果迭代器可以产生序列中的下一个值，则为 false。(这等价于不指定 done 这个属性。)
- **如果迭代器已将序列迭代完毕，则为 true**。<u>这种情况下，value 是可选的，如果它依然存在，即为迭代结束之后的默认返回值</u>

**value**

- **迭代器返回的任何 JavaScript 值**。done 为 true 时可省略。

```js
// 数组
const names = ["abc", "cba", "nba"]

// 创建一个迭代器对象来访问数组
let index = 0

const namesIterator = {
  next: function() {
    if (index < names.length) {
      return { done: false, value: names[index++] }
    } else {
      return { done: true, value: undefined }
    }
  }
}
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next()); 
console.log(namesIterator.next()); 
/* { done: false, value: 'abc' }
{ done: false, value: 'cba' }
{ done: false, value: 'nba' }
{ done: true, value: undefined } */
```

**生成迭代器的函数**

```js
function createArrayIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { done: false, value: arr[index++] };
      } else {
        return { done: true, value: undefined };
      }
    },
  };
```

**创建一个无限的迭代器**

```js
function createNumberIterator() {
  let index = 0;
  return {
    next: function () {
      return { done: false, value: index++ };
    },
  };
}
```



## 可迭代对象

当一个对象实现了iterable protocol时，它就是一个可迭代对象

这个对象的**要求是必须实现 @@iterator 方法**，在代码中我们使用 **Symbol.iterator 访问该属性;**

- 当一个对象变成一个可迭代对象的时候，进行某些迭代操作，比如 for...of 操作时，其实就会调用它的 @@iterator 方法;

```js
// 创建一个迭代器对象来访问数组
const iterableObj = {
  arr: ["a", "b", "c", "d"],
  [Symbol.iterator]: function () {//返回迭代器函数
    let index = 0;
    return {//返回一个生成迭代器函数
      next: () => {//需要箭头函数,不然this会隐式绑定到iterator
        if (index < this.arr.length) {
          return { done: false, value: this.arr[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  },
};
```

for...of可以遍历的东西必须是一个可迭代对象

```js
for (const item of iterableObj) {
  console.log(item);
}
```

 

### 原生迭代器对象

很多原生对象已经实现了可迭代协议，会生成一个迭代器对象的:  String、Array、Map、Set、arguments对象、NodeList集合;

```js
const names = ["abc", "cba", "nba"];
console.log(names[Symbol.iterator]);

const iterator1 = names[Symbol.iterator]();
console.log(iterator1.next());
console.log(iterator1.next());
console.log(iterator1.next());
console.log(iterator1.next());
// { value: 'abc', done: false }
// { value: 'cba', done: false }
// { value: 'nba', done: false }
// { value: undefined, done: true }
```

```ts
// 函数中arguments也是一个可迭代对象
function foo(x, y, z) {
  console.log(arguments[Symbol.iterator]);
  for (const arg of arguments) {
    console.log(arg);
    // [Function: values]
    // 10
    // 20
    // 30
  }
}
foo(10, 20, 30);

```



### 可迭代对象的应用

JavaScript中语法:for ...of、展开语法(spread syntax)、yield*(后面讲)、解构赋值(Destructuring_assignment); 

创建一些对象时:new Map([Iterable])、new WeakMap([iterable])、new Set([iterable])、new WeakSet([iterable]);

一些方法的调用:Promise.all(iterable)、Promise.race(iterable)、Array.from(iterable);



```ts
const iterableObj = {
  names: ["abc", "cba", "nba"],
  [Symbol.iterator]: function () {
    let index = 0;
    return {
      next: () => {
        if (index < this.names.length) {
          return { done: false, value: this.names[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  },
};
```



#### for of场景

```js
// 1.for of场景
for (o of iterableObj) {
  console.log(o);
}
```

#### ...展开语法(spread syntax)

```ts
const names = ["abc", "cba", "nba"];
const newNames = [...names, ...iterableObj];
console.log(newNames);//[ 'abc', 'cba', 'nba', 'abc', 'cba', 'nba' ]
```

- 注意:ES9(ES2018)中新增的一个针对对象的特性,用的不是迭代器

```ts
const obj = { name: "pithy", age: 18 };
const obj2 = { hobby: "sleep" };
const newObj = { ...obj, ...obj2 };
console.log(newObj);//{ name: 'pithy', age: 18, hobby: 'sleep' }
```

#### 解构语法

```ts
const [name1, name2] = names;
// const { name, age } = obj 不一样ES9新增的特性
```

#### 创建一些其他对象时

```ts
//传入可迭代对象
const set1 = new Set(iterableObj);
const set2 = new Set(names);

const arr1 = Array.from(iterableObj);

```

#### Promise.all

```js
promise.all(iterableObj).then((res) => {
  console.log(res);
});

```



## 自定义类的迭代

在面向对象开发中，我们可以通过class定义一个自己的类，这个类可以创建很多的对象:

如果我们也希望自己的类创建出来的对象默认是可迭代的，那么在设计类的时候我们就可以添加上 @@iterator 方法;

```ts
// 案例: 创建一个教室类, 创建出来的对象都是可迭代对象
class Classroom {
  constructor(address, name, students) {
    this.address = address;
    this.name = name;
    this.students = students;
  }

  entry(newStudent) {
    this.students.push(newStudent);
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.students.length) {
          return { done: false, value: this.students[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
      return: () => {
        console.log("迭代器提前终止了~");
        return { done: true, value: undefined };
      },
    };
  }
}
// 
//TEST
const classroom = new Classroom("3幢5楼205", "计算机教室", [
  "james",
  "kobe",
  "curry",
  "why",
]);
classroom.entry("lilei");

for (const stu of classroom) {
  console.log(stu);
  if (stu === "why") break;
}
```



## 迭代器的中断

迭代器在某些情况下会在没有完全迭代的情况下中断:

- 比如遍历的过程中通过break、continue、return、throw中断了循环操作
- 比如在解构的时候，没有解构所有的值;

监听中断可以添加return方法:

```js
      return: () => {
        console.log("迭代器提前终止了~");
        return { done: true, value: undefined };
      },
```



# 生成器

 生成器是ES6中新增的一种**函数**控制、使用的方案，它可以让我们更加灵活的控制函数什么时候暂停执行\继续执行等。



**生成器函数**也是一个函数，但是和普通的函数有一些区别:

- 首先，生成器函数需要在function的后面加一个符号:**`*`**
- 其次，生成器函数可以通过**yield**关键字来**控制函数的执行流程:**
- 最后，生成器函数的**返回值是一个Generator(生成器):**

还可以使用**`yield*`**来生产一个可迭代对象:

- 这个时候相当于是一种yield的语法糖，只不过**会依次迭代这个可迭代对象，每次迭代其中的一个值;**



```ts
// 当遇到yield时候值暂停函数的执行
// 当遇到return时候生成器就停止执行
```

生成器事实上是一种特殊的迭代器;

> MDN:Instead, they return a special type of iterator, called a Generator.

```js
function* foo() {
  console.log("函数开始执行~")

  const value1 = 100
  console.log("第一段代码:", value1)
  yield

  const value2 = 200
  console.log("第二段代码:", value2)
  yield

  const value3 = 300
  console.log("第三段代码:", value3)
  yield

  console.log("函数执行结束~")
}

```

生成器函数只是返回了一个生成器对象,通过调用next方法执行函数

```js
// 调用生成器函数时, 会给我们返回一个生成器对象
const generator = foo() //Object [Generator] {}

// 开始执行第一段代码
generator.next()

// 开始执行第二端代码
console.log("-------------")
generator.next()
generator.next()
console.log("----------")
generator.next()

//函数开始执行~
// 第一段代码: 100
// -------------
// 第二段代码: 200
// 第三段代码: 300
// ----------
// 函数执行结束~
```

如果不希望next返回的是一个undefined，这个时候我们可以**通过yield来返回结果;**

```ts
function* foo() {
  console.log("函数开始执行~")
  const value1 = 100
  console.log("第一段代码:", value1)
  yield value1
  const value2 = 200
  console.log("第二段代码:", value2)
  yield value2
}
const generator = foo()
console.log("返回值1:", generator.next())// { value: 100, done: false }
```



## ‼️生成器传递参数 – next函数

给每个分段来传递参数

- 调用next函数的时候，可以给它传递参数，那么这个参数会**作为<u>上一个</u>yield语句的返回值**

- 也就是说我们是为本次的函数代码块执行提供了一个值;

```js
function* foo(num) {
  console.log("函数开始执行~")

  const value1 = 100 * num//5
  console.log("第一段代码:", value1)
  const n = yield value1//10

  const value2 = 200 * n
  console.log("第二段代码:", value2)
  const count = yield value2//25

  const value3 = 300 * count
  console.log("第三段代码:", value3)
  yield value3

  console.log("函数执行结束~")
  return "123"
}
```

```js
// 生成器上的next方法可以传递参数
const generator = foo(5)
console.log(generator.next())

// 第二段代码, 第二次调用next的时候执行的
console.log(generator.next(10))
console.log(generator.next(25))

```

## 生成器提前结束 – return函数

通过return函数也可以给生成器函数传递参数:

**return传值后这个生成器函数就会结束，之后调用next不会继续生成值了;**

```js
function* foo(num) {
  console.log("函数开始执行~")

  const value1 = 100 * num
  console.log("第一段代码:", value1)
  const n = yield value1

  //相当于 return 15

  const value2 = 200 * n
  console.log("第二段代码:", value2)
  const count = yield value2
}
const generator = foo(10)
console.log(generator.next())

// 第二段代码的执行, 使用了return
// 那么就意味着相当于在第一段代码的后面加上return, 就会提前终端生成器函数代码继续执行
console.log(generator.return(15))//{ value: 15, done: true }

console.log(generator.next())//{ value: undefined, done: true }
console.log(generator.next())//{ value: undefined, done: true }
console.log(generator.next())//{ value: undefined, done: true }
  
```



## 生成器抛出异常 – throw函数

除了给生成器函数内部传递参数之外，也可以给生成器函数内部抛出异常:

~~但是**在catch语句中不能继续yield新的值**了，但是可以**在catch语句外使用yield继续中断函数的执行;**~~

**可以获取catch中yield的值**

```js
function* foo() {
  console.log("代码开始执行~")

  const value1 = 100
  try {
    yield value1
  } catch (error) {
    console.log("捕获到异常情况:", error)

    yield "不能获取到catch中yield的值"
  }

  console.log("第二段代码继续执行")
  const value2 = 200
  yield value2

  console.log("代码执行结束~")
}

const generator = foo()

const result = generator.next()
if (result.value !== 200) {
  console.log(generator.throw("error message"))
}

//代码开始执行~
//捕获到异常情况: error message
//{ value: '不能获取到catch中yield的值', done: false }
```



## 生成器替代迭代器

```ts
// 1.生成器来替代迭代器
function* createArrayIterator(arr) {
  // 3.第三种写法 
  yield* arr//会依次迭代这个可迭代对象，每次迭代其中的一个值

  // 2.第二种写法
  // for (const item of arr) {
  //   yield item
  // }
  // 1.第一种写法
  // yield "abc" // { done: false, value: "abc" }
  // yield "cba" // { done: false, value: "abc" }
  // yield "nba" // { done: false, value: "abc" }
}
```

```ts
// 2.创建一个函数, 这个函数可以迭代一个范围内的数字
// 10 20
function* createRangeIterator(start, end) {
  let index = start
  while (index < end) {
    yield index++
  }
	//相当于
  // let index = start
  // return {
  //   next: function() {
  //     if (index < end) {
  //       return { done: false, value: index++ }
  //     } else {
  //       return { done: true, value: undefined }
  //     }
  //   }
  // }
}
//TEST
const rangeIterator = createRangeIterator(10, 20)
console.log(rangeIterator.next())
console.log(rangeIterator.next())
console.log(rangeIterator.next())

```

```ts
// 2.创建一个函数, 这个函数可以迭代一个范围内的数字
// 10 20
function* createRangeIterator(start, end) {
  let index = start
  while (index++ < end) {
    yield index
  }
}
```



## 自定义类迭代 – 生成器实现

```ts
// 3.class案例
class Classroom {
  constructor(address, name, students) {
    this.address = address
    this.name = name
    this.students = students
  }

  entry(newStudent) {
    this.students.push(newStudent)
  }

  foo = () => {
    console.log("foo function")
  };

//生成器实现
  *[Symbol.iterator]() {
    yield* this.students
  }
}

const classroom = new Classroom("3幢", "1102", ["abc", "cba"])
for (const item of classroom) {
  console.log(item)
}

```

## 对生成器的操作

可迭代对象的应用都可以

JavaScript中语法:for ...of、展开语法(spread syntax)、yield*(后面讲)、解构赋值(Destructuring_assignment); 

创建一些对象时:new Map([Iterable])、new WeakMap([iterable])、new Set([iterable])、new WeakSet([iterable]);

一些方法的调用:Promise.all(iterable)、Promise.race(iterable)、Array.from(iterable);





# 异步处理方案

需求:

- 我们需要向服务器发送网络请求获取数据，一共需要发送三次请求
- 第二次的请求url依赖于第一次的结果;
- 第三次的请求url依赖于第二次的结果;

**回调地狱**

![image-20220717083029879](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207170830934.png)

```ts
// 1.第一种方案: 多次回调
// 回调地狱
requestData("why").then(res => {
  requestData(res + "aaa").then(res => {
    requestData(res + "bbb").then(res => {
      console.log(res)
    })
  })
})
// 2.第二种方案: Promise中then的返回值来解决
requestData("why").then(res => {
  return requestData(res + "aaa")
}).then(res => {
  return requestData(res + "bbb")
}).then(res => {
  console.log(res)
})


```

## Generator

```ts
// 3.第三种方案: Promise + generator实现
function* getData() {
  const res1 = yield requestData("why")
  const res2 = yield requestData(res1 + "aaa")
  const res3 = yield requestData(res2 + "bbb")
  const res4 = yield requestData(res3 + "ccc")
  console.log(res4)
}
// 1> 手动执行生成器函数
const generator = getData()
generator.next().value.then((res) => {
  generator.next(res).value.then((res) => {
    generator.next(res).value.then((res) => {
      generator.next(res)
    })
  })
})
```

- 不能确定到底需要调用几层的Promise关系;
- 如果还有其他需要这样执行的函数，我们应该如何操作呢?自动执行generator函数



## 自动执行generator函数

封装一个工具函数execGenerator自动执行生成器函数:

```ts
// 2> 自己封装了一个自动执行的函数
function execGenerator(genFn) {
  const generator = genFn()
  function exec(res) {
    const result = generator.next(res)
    if (result.done) {
      return result.value
    }
    result.value.then(res => {
      exec(res)
    })
  }
  exec()
}
```

## 第三方包CO

```ts
const co = require('co')
co(getData)
```

## async/await

```ts
// 4.第四种方案: async/await
async function getData() {
  const res1 = await requestData("why")
  const res2 = await requestData(res1 + "aaa")
  const res3 = await requestData(res2 + "bbb")
  const res4 = await requestData(res3 + "ccc")
  console.log(res4)
}

getData()
```

