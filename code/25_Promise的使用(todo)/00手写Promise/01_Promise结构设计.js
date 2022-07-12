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
        this.value=value
        console.log('resolve被调用');
      }
    }
    const reject=(reason)=>{
      if(this.status===PROMISE_STATUS_PENDING){
        this.status=PROMISE_STATUS_REJECTED
        this.reason=reason
        console.log('reject被调用');
      }
    }
    executor(resolve,reject)
  }

}
const mypromise=new MyPromise((resolve,reject)=>{
  console.log('123');
  // resolve(123)
  reject('456')
})