const obj ={
  name:'pithy',
  age:22
}

// Object.defineProperty(obj,'name',{
//   set:function(){
//     console.log('set');
//   },
//   get:function(){
//     console.log('get');
//   }
// })

// console.log(obj.name);
// obj.name='wspi'

Object.keys(obj).forEach((key)=>{
  let value=obj[key]
  Object.defineProperty(obj,key,{
    get:function(){
      console.log(`监听obj对象的${key}属性被访问 `);
      return value
    },
    set:function(newVal){
      console.log(`监听到obj对象的${key}属性被赋值 `);
      value=newVal
    }
  })
})
obj.name='awspi'
obj.age=18
console.log(obj.age);