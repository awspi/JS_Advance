function debounce(fn, delay) {
  //定义一个定时器,保存上一次的定时器
  let timer = null
  const _debounce = function () {
    //取消上一次的定时器
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      //元素真正执行的函数是_debounce 所以fn的this要和_debounce的this相同,参数也是
      fn.apply(this, arguments)
    }, delay)
  }

  return _debounce
}
