let reactiveFns=[]
//封装响应式函数
function watchFn(fn){
  reactiveFns.push(fn)
}

//对象的响应式
const obj={
  name:'pithy',
  age:18
}

watchFn(function(){
  const newName=obj.name
  console.log(obj.name)
})