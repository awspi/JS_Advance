function throttle(fn, interval, options = { leading: true, trailing: false }) {
  const { leading, trailing } = options //首尾是否执行
  // 1.记录上一次的开始时间
  let lastTime = 0
  // 2.事件触发时, 真正执行的函数
  const _throttle = function () {
    // 2.1.获取当前事件触发时的时间
    const nowTime = new Date().getTime()
    //!如果是第一次,就直接让lastTime=nowTime -->此时remainTime=interval 不会触发
    if (!lastTime && !leading) lastTime = nowTime
    // 2.2.使用当前触发的时间和之前的时间间隔以及上一次开始的时间,
    //计算出还剩余多长事件需要去触发函数
    const remainTime = interval - (nowTime - lastTime)
    //第一次会直接执行 because: remainTime=(1000-100000-0)<=0
    if (remainTime <= 0) {
      // 2.3.真正触发函数
      fn()
      // 2.4.保留上次触发的时间
      lastTime = nowTime
    }
  }
  return _throttle
}
