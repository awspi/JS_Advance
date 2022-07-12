const PROMISE_STATUS_PENDING='pending'
const PROMISE_STATUS_FULFILLED='fulfilled'
const PROMISE_STATUS_REJECTED='reject'

class MyPromise{
  constructor(executor){
    this.status=PROMISE_STATUS_PENDING
    this.value=undefined
    this.reason=undefined

    const resolve=(value)=>{
      if(this.status===PROMISE_STATUS_PENDING){
        this.status=PROMISE_STATUS_FULFILLED
          queueMicrotask(()=>{//微任务
          this.value=value
          this.onFulfilled(this.value)
        },0)//
      }
    }
    const reject=(reason)=>{
      if(this.status===PROMISE_STATUS_PENDING){
        this.status=PROMISE_STATUS_REJECTED
        queueMicrotask(()=>{
          this.reason=reason
          this.onRejected(this.reason)
        },0)
      }
    }
    executor(resolve,reject)
  }
  
  then(onFulfilled,onRejected){
    this.onFulfilled=onFulfilled
    this.onRejected=onRejected
  }
}
const mypromise=new MyPromise((resolve,reject)=>{
  console.log('pendding');
  resolve('123')
  reject('456')
})
mypromise.then(res=>{
  console.log(res)
},err=>{
  console.log(err);
})