var obj = {
  // 私有属性(js里面是没有严格意义的私有属性)
  _age: 18,
  _eating: function() {}
}

Object.defineProperties(obj, {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "why"
  },
  age: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this._age
    },
    set: function(value) {
      this._age = value
    }
  }
})

// 获取某一个特性属性的属性描述符
console.log(Object.getOwnPropertyDescriptor(obj, "name"))
//{ value: 'why', writable: true, enumerable: true, configurable: true }
console.log(Object.getOwnPropertyDescriptor(obj, "age"))
/* 
{
  get: [Function: get],
  set: [Function: set],
  enumerable: true,
  configurable: true
}
*/

// 获取对象的所有属性描述符
console.log(Object.getOwnPropertyDescriptors(obj))
/* 
{
  _age: { value: 18, writable: true, enumerable: true, configurable: true },
  _eating: {
    value: [Function: _eating],
    writable: true,
    enumerable: true,
    configurable: true
  },
  name: {
    value: 'why',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    get: [Function: get],
    set: [Function: set],
    enumerable: true,
    configurable: true
  }
}
*/