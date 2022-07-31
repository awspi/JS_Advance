/**
 *
 * @param {Function} fn 需要防抖的函数
 * @param {Number} delay 间隔时间
 * @param {Boolean} immediate 是否立刻执行
 * @param {Function} cb 回调函数
 * @returns
 */

function debounce(fn, delay, immediate = false, cb) {
  //定义一个定时器,保存上一次的定时器
  let timer = null
  let isInvoke = false //是否执行过
  let res = null //保存函数返回值

  const _debounce = function () {
    //取消上一次的定时器
    timer && clearTimeout(timer)
    //判断是否立即执行
    if (immediate && !isInvoke) {
      fn.apply(this, arguments)
      cb && cb(res) //如果有传入回调函数,就调用并传入返回值
      isInvoke = true
    } else {
      timer = setTimeout(() => {
        //元素真正执行的函数是_debounce
        res = fn.apply(this, arguments)
        cb && cb(res) //如果有传入回调函数,就调用并传入返回值
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
