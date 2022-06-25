//使用数组收集函数不方便管理
//使用一个类
class Depend{
  constructor(){
    this.reactiveFns=[]
  }
  addDepend(fn){
    this.reactiveFns.push(fn)
  }
  notify(){
    this.reactiveFns.forEach(fn=>{
      fn()
    })
  }
}

//封装响应式函数
let activeReaciveFn=null
function watchFn(fn){
  activeReaciveFn=fn
  fn()
  activeReaciveFn=null
}

const targetMap=new WeakMap()
//封装一个获取Depend的函数
function getDepend(target,key){
  //根据target对象获取map
  let map = targetMap.get(target)
  if(!map){
    map=new Map()
  }
  targetMap.set(target,map)
  //根据key获取depend对象
  let depend=map.get(key)
  if(!depend){
    depend=new Depend()
    map.set(key, depend)//加入depend
  }
  return depend
}

//对象的响应式
const obj={
  name:'pithy',//depend对象
  age:18
}

//监听对象的属性变量 Proxy/defineProperty
//设置代理对象
const objProxy=new Proxy(obj,{//get就收集依赖
    //根据target,key 获取对应的depend
    get:function(target,key,receiver){
    const depend=getDepend(target,key)
    //给depend对象中添加响应式函数
    depend.addDepend(activeReaciveFn)
    return Reflect.get(target,key,receiver)
  },
  set:function(target,key,newValue,receiver){//set就notify()
    Reflect.set(target,key,newValue,receiver)
    const depend=getDepend(target,key)
    depend.notify()
  },
})


watchFn(function(){
  console.log(objProxy.name,'name func ————————————');
})
watchFn(function(){
  console.log(objProxy.age,'age func1 ————————————');
})
watchFn(function(){
  console.log(objProxy.age,'age func2 ————————————');
})
console.log('-——————————————————————————————————');
objProxy.name='123'
objProxy.age=1
// objProxy.name='awspi'
// console.log(objProxy.name);