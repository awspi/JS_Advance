const isObject = (value) => {
  const valueType = typeof value
  return value !== null && (valueType === "object" || valueType === "function")
}
//!递归调用
//* map在全局作用域无法被清除,在函数体内,递归后无法获取到上一次函数体的map,把map放在参数中初始化,后续递归时传入更新后的map
function deepClone(originValue, map = new WeakMap()) {
  //?判断是否是Set类型
  if (originValue instanceof Set) {
    return new Set([...originValue])
  }

  //?判断是否是Map类型
  if (originValue instanceof Map) {
    return new Map([...originValue])
  }

  //?判断是否是symbol类型
  if (typeof originValue === "symbol") return Symbol(originValue.description) //*返回一个新symbol

  //?判断是否是函数类型
  if (typeof originValue === "function") return originValue

  //?判断是否是对象类型
  if (!isObject(originValue)) return originValue

  //*如果已经存在key为originValue的value 就直接取出
  if (map.has(originValue)) {
    return map.get(originValue)
  }
  //?判断传入的是数组还是对象
  let newObject = Array.isArray(originValue) ? [] : {}
  map.set(originValue, newObject)

  //*clone
  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key], map)
  }
  //*对symbol作为key进行特殊处理(for遍历不到symbol)
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const sKey of symbolKeys) {
    //*没必要再深拷贝sKey->symbol作为key是为了在同一个对象中使用相同的key,但是不同对象之间可以使用同一个的symbol
    // const newSKey = Symbol(sKey.description)
    // newObject[newSKey] = deepClone(originValue[sKey])
    newObject[sKey] = deepClone(originValue[sKey], map)
  }

  return newObject
}

//测试代码
// 测试代码
let s1 = Symbol("aaa")
let s2 = Symbol("bbb")

const obj = {
  name: "why",
  age: 18,
  friend: {
    name: "james",
    address: {
      city: "广州",
    },
  },
  // 数组类型
  hobbies: ["abc", "cba", "nba"],
  // 函数类型
  foo: function (m, n) {
    console.log("foo function")
    console.log("100代码逻辑")
    return 123
  },
  // Symbol作为key和value
  [s1]: "abc",
  s2: s2,
  // Set/Map
  set: new Set(["aaa", "bbb", "ccc"]),
  map: new Map([
    ["aaa", "abc"],
    ["bbb", "cba"],
  ]),
}

const newObj = deepClone(obj)
//循环引用
newObj.info = newObj
console.log(newObj.info.info)
