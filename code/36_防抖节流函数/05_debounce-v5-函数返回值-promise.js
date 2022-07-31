/**
 *
 * @param {Function} fn 需要防抖的函数
 * @param {Number} delay 间隔时间
 * @param {Boolean} immediate 是否立刻执行
 * @returns
 */

function debounce(fn, delay, immediate = false, cb) {
  //定义一个定时器,保存上一次的定时器
  let timer = null
  let isInvoke = false //是否执行过

  //返回promise
  const _debounce = function () {
    return new Promise((resolve, reject) => {
      //取消上一次的定时器
      timer && clearTimeout(timer)
      //判断是否立即执行
      if (immediate && !isInvoke) {
        const result = fn.apply(this, arguments)
        resolve(result)
        isInvoke = true
      } else {
        timer = setTimeout(() => {
          //元素真正执行的函数是_debounce
          const result = fn.apply(this, arguments)
          resolve(result)
          isInvoke = false
        }, delay)
      }
    })
  }
  //取消功能
  _debounce.cancel = function () {
    timer && clearTimeout(timer)
    timer = null
    isInvoke = false
  }
  return _debounce
}
