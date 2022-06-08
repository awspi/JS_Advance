// var n=100
// function foo(){
//   n=200
// }
// foo()
// console.log(n);//200

// function foo(){
//   console.log(n)
//   var n=200
//   console.log(n)
// }
// var n=100 
// foo()

// var a=100
// function foo(){
//   console.log(a)
//   return
//   var a=100 
// }
// foo()

// function foo(){
//   var a=b=100
// }
// foo()
// console.log(a); //ReferenceError: a is not defined
// console.log(b);


var n=100
function foo1(){
  console.log(n);//100
}
function foo2(){
  var n=200
  console.log(n);//200
  foo1()
}
foo2()
console.log(n);//100