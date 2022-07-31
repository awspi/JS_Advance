class FakeEventBus {
  constructor() {
    this.eventBus = {}
  }
  on(eventName, eventCallback, thisArg) {
    //TODO 检查参数类型
    let handlers = this.eventBus[eventName]
    if (!handlers) {
      handlers = []
      this.eventBus[eventName] = handlers
    }
    handlers.push({
      eventCallback,
      thisArg,
    })
  }
  off(eventName, eventCallback) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    const newHandler = [...handlers]
    for (let i = 0; i < newHandler.length; i++) {
      const handler = newHandler[i]
      if (handler.eventCallback === eventCallback) {
        const index = handlers.indexOf(handler)
        handlers.splice(index, 1)
      }
    }
  }
  emit(eventName, ...payload) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    handlers.forEach((handler) => {
      handler.eventCallback.apply(handler.thisArg, payload)
    })
  }
}

const eventBus = new FakeEventBus()

// TEST
//*handleCallback
const handleCallback1 = function () {
  console.log("监听eventName|1", this, arguments)
}
const handleCallback2 = function () {
  console.log("监听eventName|2", this, arguments)
}
//
eventBus.on("eventName", handleCallback1, { name: "pithy" })
eventBus.on("eventName", handleCallback2, { name: "awspi" })
//
eventBus.off("eventName", handleCallback1)
//
eventBus.emit("eventName", "arg1", "arg2")
