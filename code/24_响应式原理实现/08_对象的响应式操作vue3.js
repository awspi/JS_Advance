// 响应式依赖的收集 Depend
class Depend {
  constructor() {
    this.reactiveFns = new Set()
  }
  addDepend(fn) {
    this.reactiveFns.add(fn)
  }
  notify() {
    this.reactiveFns.forEach(fn => fn())
  }
  depend() {
    activeReaciveFn && this.addDepend(activeReaciveFn)
  }
}

//封装响应式函数
let activeReaciveFn = null
function watchFn(fn) {
  activeReaciveFn = fn
  fn()
  activeReaciveFn = null
}

const targetMap = new WeakMap()
//封装一个获取Depend的函数
function getDepend(target, key) {
  //根据target对象获取map
  let map = targetMap.get(target)
  if (!map) {
    map = new Map()
  }
  targetMap.set(target, map)
  //根据key获取depend对象
  let depend = map.get(key)
  if (!depend) {
    depend = new Depend()
    map.set(key, depend)//加入depend
  }
  return depend
}


//创建响应式对象Proxy +rRflect
function reactive(obj) {
  return new Proxy(obj, {//get就收集依赖
    //根据target,key 获取对应的depend
    get: function (target, key, receiver) {
      const depend = getDepend(target, key)
      //给depend对象中添加响应式函数
      depend.depend()
      return Reflect.get(target, key, receiver)
    },
    set: function (target, key, newValue, receiver) {//set就notify()
      Reflect.set(target, key, newValue, receiver)
      const depend = getDepend(target, key)
      depend.notify()
    }
  })
}





// ########TEST#########a

obj = {
  name: 'pithy',//depend对象
  age: 18
}
const objProxy = reactive(obj)

watchFn(function () {
  console.log(objProxy.name, '----');
  console.log(objProxy.name, '++++');
  console.log(objProxy.name, '++++');
})
watchFn(function () {
  console.log(objProxy.age, '####');
})

console.log('-——————————————————————————————————');
