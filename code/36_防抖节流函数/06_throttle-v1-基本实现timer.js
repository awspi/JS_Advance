function throttle(fn, interval) {
  let timer = null
  const _throttle = function () {
    if (timer) return

    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, interval)
  }
  return _throttle
}
