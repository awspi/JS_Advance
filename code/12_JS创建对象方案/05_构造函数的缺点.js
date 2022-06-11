function foo() {
  this.bar=function(){
    console.log('bar');
  }
}

var f1 = new foo
var f2 = new foo

console.log(f1.bar === f2.bar) //false
//对象里相同的函数却创建了两个实例
