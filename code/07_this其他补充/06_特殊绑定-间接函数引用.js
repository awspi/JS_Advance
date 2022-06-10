// 争论: 代码规范 ;

var obj1 = {
  name: "obj1",
  foo: function() {
    console.log(this)
  }
}

var obj2 = {
  name: "obj2"
};

// obj2.bar = obj1.foo
// obj2.bar()//{name: 'obj2', bar: ƒ}






//obj1.foo
(obj2.bar = obj1.foo)()//属于独立的函数调用
// 当用()括起来的时候,相当于把两段代码看成一个整体

