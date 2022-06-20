// const weakSet = new WeakSet()

// // 1.区别一: 只能存放对象类型
// // TypeError: Invalid value used in weak set
// // weakSet.add(10)

// // 强引用和弱引用的概念(看图)

// // 2.区别二: 对对象是一个弱引用
// let obj = { 
//   name: "why"
// }

// // weakSet.add(obj)

// const set = new Set()
// // 建立的是强引用
// set.add(obj)

// // 建立的是弱引用
// weakSet.add(obj)

// 3.WeakSet的应用场景
const personSet = new WeakSet()
//weakSet存放通过构造函数生成的对象


class Person {
  constructor() {
    personSet.add(this)//
  }

  running() {
    if (!personSet.has(this)) {
      throw new Error("不能通过非构造方法创建出来的对象调用running方法")
    }
    console.log("running~", this)
  }
}

let p = new Person()
p.running()

// p.running.call({name: "why"})

//Q:为啥不用Set
//A:Set的话 personSet.add(this),set对构造函数生成的对象就是强引用,如果让p = null,则p还会被set强引用,不回被GC回收