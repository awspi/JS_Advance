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
  },

  //监听in到捕获器
  has:function(target,key){
    console.log(`监听到对象的${key}属性in操作 `,target);
    return key in target
  },
  //监听del到捕获器
  deleteProperty:function(target,key){
    console.log(`监听到对象的${key}属性del操作 `,target);
    delete target[key]
  },
})

// in操作符
console.log("name" in ObjProxy)//监听到对象的name属性in操作  { name: 'pithy', age: 22 }

// delete操作
delete ObjProxy.name//监听到对象的name属性del操作  { name: 'pithy', age: 22 }
