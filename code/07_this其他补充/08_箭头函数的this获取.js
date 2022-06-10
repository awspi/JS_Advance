// 1.测试箭头函数中this指向
// var name = "why"
// function foo(){
//   console.log(this);
// }
// var foo = () => {
//   console.log(this)
// }

// foo()//window
// var obj = {foo1: foo}
// obj.foo1()//window
// foo.call("abc")//window

// 2.应用场景
var obj = {
  data: [],
  getData: () =>{
    // 发送网络请求, 将结果放到上面data属性中
    // 在箭头函数之前的解决方案
    // var _this = this
    // setTimeout(function() {//setTimeout的this指向window
    //   var result = ["abc", "cba", "nba"]
    //   _this.data = result
    // }, 2000);
    // 箭头函数之后
    setTimeout(() => {
      var result = ["abc", "cba", "nba"]
      
      this.data = result
    }, 2000);
  }
}

obj.getData()
setTimeout(() => {
  console.log(obj.data);
}, 2001);
