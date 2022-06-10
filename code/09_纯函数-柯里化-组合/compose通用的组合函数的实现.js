function mycompose(...fns) {
  // fns.length
  for (var i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError('Expected arguments are functions')
    }
  }
  function compose(...args) {
    var index = 0
    var result = fns.length ? fns[index].apply(this, args) : args//fns.length==0,result=args result当作下次调用的参数
    while (++index < fns.length) {
      fns[index].call(this, result)
    }
    return result
  }
  return compose
}


// TEST
function double(m) {
  return m * 2
}

function square(n) {
  return n ** 2
}

var newFn = mycompose(double, square)
console.log(newFn(10));