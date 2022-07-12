function foo(){
  return new Promise((resolve,reject)=>{
    // resolve() 
    // reject()
  })
}

const fooPromise=foo()
// then方法传入的回调函数两个回调函数:
// > 第一个回调函数, 会在Promise执行resolve函数时, 被回调
// > 第二个回调函数, 会在Promise执行reject函数时, 被回调
fooPromise.then(()=>{
//success
},()=>{
//fail
})
//executor
const promise = new Promise(() => {
  console.log('promise传入的函数被执行');

})
// console.log(Object.getOwnPropertyDescriptors(Promise))