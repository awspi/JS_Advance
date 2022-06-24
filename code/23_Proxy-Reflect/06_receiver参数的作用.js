const obj={
  _name:'pithy',
  get name(){
    return this._name
  },
  set name(newVal){
    this._name=newVal//this指向obj 不是objProxy
  }
}

const objProxy=new Proxy(obj,{
  get:function(target,key,receiver){
    //receiver是创建出来的代理对象
    console.log(`监听到对象的${key}属性被访问 `,target,receiver);
    return Reflect.get(target,key,receiver)
  },
  set:function(target,key,newVal,receiver
    ){
    console.log(`监听到对象的${key}属性被赋值 `,target);
    Reflect.set(target,key,newVal,receiver)
  }
})

objProxy.name='awspi'
console.log(objProxy.name);