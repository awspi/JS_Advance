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

const depend= new Depend()
//封装响应式函数
function watchFn(fn){
  depend.addDepend(fn)
}

//对象的响应式
const obj={
  name:'pithy',//depend对象
  age:18
}

//监听对象的属性变量 Proxy
//设置代理对象
const objProxy=new Proxy(obj,{
  get:function(target,key,receiver){
    return Reflect.get(target,key,receiver)
  },
  set:function(target,key,newValue,receiver){
    Reflect.set(target,key,newValue,receiver)
    depend.notify()//
  },
})




watchFn(function(){
  console.log(objProxy.name,'demo func ————————————');
})
objProxy.name='awspi'
console.log(objProxy.name);