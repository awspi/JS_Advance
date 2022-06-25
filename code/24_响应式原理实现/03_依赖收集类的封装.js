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

watchFn(function(){
  console.log(obj.name,'demo func ————————————');
})
obj.name='awspi'

console.log(obj.name);
depend.notify()