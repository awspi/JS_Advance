function debounce(fn, delay, immediate = false) {
  //定义一个定时器,保存上一次的定时器
  let timer = null
  let isInvoke = false //是否执行过
  const _debounce = function () {
    //取消上一次的定时器
    timer && clearTimeout(timer)
    //判断是否立即执行
    if (immediate && !isInvoke) {
      fn.apply(this, arguments)
      isInvoke = true
    } else {
      timer = setTimeout(() => {
        //元素真正执行的函数是_debounce
        fn.apply(this, arguments)
        isInvoke = false
      }, delay)
    }
  }
  //取消功能
  _debounce.cancel = function () {
    timer && clearTimeout(timer)
    timer = null
    isInvoke = false
  }
  return _debounce
}
