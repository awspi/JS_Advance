// 当遇到yield时候值暂停函数的执行
// 当遇到return时候生成器就停止执行
function* foo() {
  console.log("函数开始执行~")

  const value1 = 100
  console.log("第一段代码:", value1)
  yield value1

  const value2 = 200
  console.log("第二段代码:", value2)
  yield value2

  const value3 = 300
  console.log("第三段代码:", value3)
  yield value3

  console.log("函数执行结束~")
  return "123"
}

// generator本质上是一个特殊的iterator
const generator = foo()
console.log("返回值1:", generator.next())
console.log("返回值2:", generator.next())
console.log("返回值3:", generator.next())
console.log("返回值3:", generator.next())
// 函数开始执行~
// 第一段代码: 100
// 返回值1: { value: 100, done: false }
// 第二段代码: 200
// 返回值2: { value: 200, done: false }
// 第三段代码: 300
// 返回值3: { value: 300, done: false }
// 函数执行结束~
// 返回值3: { value: '123', done: true }
