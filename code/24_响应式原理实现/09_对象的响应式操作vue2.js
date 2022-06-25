// 响应式依赖的收集 Depend
class Depend{
  constructor(){
    this.reactiveFns=new Set()
  }
  addDepend(fn){
    this.reactiveFns.add(fn)
  }
  notify(){
    this.reactiveFns.forEach(fn=>{
      fn()
    })
  }
  depend(){
    if (activeReaciveFn){
      this.addDepend(activeReaciveFn)
    }
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

//封装获取Depend的函数
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

 
//创建响应式对象 defineProperty
function reactive(obj){
  Object.keys(obj).forEach(key=>{
    let value=obj[key]
    Object.defineProperty(obj,key,{
      get:function(){
        const depend=getDepend(obj,key)
        depend.depend()
        return value
      },
      set:function(newValue){
        value=newValue
        const depend=getDepend(obj,key)
        depend.notify()
      },
    })
  })
  return obj
}



// ########TEST#########

obj={
  name:'pithy',//depend对象
  age:18
}
const objProxy=reactive(obj)

watchFn(function(){
  console.log(objProxy.name,'----');
  console.log(objProxy.name,'++++');
  console.log(objProxy.name,'++++');
})
watchFn(function(){
  console.log(objProxy.age,'####');
})

console.log('-——————————————————————————————————');
objProxy.name='123'