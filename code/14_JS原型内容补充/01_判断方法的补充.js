var obj = {
  name: "obj",
  age: 18
}

var info = Object.create(obj, {
  //第二个参数可以加入属性,用 属性描述符的形式
  address: {
    value: "北京市",
    enumerable: true//不写的话默认是false
  },
  tel:{
    value:10086,
    writable:false,
    configurable:false,
    enumerable: true
  }
})

console.log(info);//{ address: '北京市', tel: 10086 }
console.log(info.__proto__);//{ name: 'obj', age: 18 }

// hasOwnProperty方法判断
console.log(info.hasOwnProperty("address"))//true
console.log(info.hasOwnProperty("name"))//false

// in 操作符: 不管在当前对象还是原型中返回的都是true
console.log("address" in info)
console.log("name" in info)

// // for in
// for (var key in info) {
//   console.log(key)
// }

