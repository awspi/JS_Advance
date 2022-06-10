function double(num) {
  return num * 2
}
function square(num) {
  return num ** 2
}

var count = 10
var result = square(double(count))
console.log(result)

// 实现最简单的组合函数composeFn
function composeFn(m, n) { // 先double再square
  return function(count) {
    // m(count)->n(m(count))
    return n(m(count))
  }
}

var newFn = composeFn(double, square)
console.log(newFn(10))

