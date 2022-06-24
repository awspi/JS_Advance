const obj ={
  name:'pithy',
  age:22
}

const ObjProxy=new Proxy(obj,{
  get:function(target,key){
    console.log(`监听到对象的${key}属性被访问 `,target);
    return target[key]
  },
  set:function(target,key,newVal){
    console.log(`监听到对象的${key}属性被赋值 `,target);
    target[key]=newVal
  }

})
console.log(ObjProxy.name)
console.log(ObjProxy.age)

ObjProxy.name='awspi'
ObjProxy.age=12

console.log(obj.name)
console.log(obj.age)