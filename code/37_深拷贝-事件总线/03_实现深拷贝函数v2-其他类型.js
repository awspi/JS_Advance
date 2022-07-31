const isObject = (value) => {
  const valueType = typeof value
  return value !== null && (valueType === "object" || valueType === "function")
}
//!递归调用
function deepClone(originValue) {
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

  //*数组类型
  let newObject = Array.isArray(originValue) ? [] : {}
  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key])
  }
  //*对symbol作为key进行特殊处理(for遍历不到symbol)
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const sKey of symbolKeys) {
    //*没必要再深拷贝sKey->symbol作为key是为了在同一个对象中使用相同的key,但是不同对象之间可以使用同一个的symbol
    // const newSKey = Symbol(sKey.description)
    // newObject[newSKey] = deepClone(originValue[sKey])
    newObject[sKey] = deepClone(originValue[sKey])
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
console.log(newObj === obj)
console.log(newObj.s2 === obj.s2)

obj.friend.name = "kobe"
obj.friend.address.city = "成都"
console.log(newObj)
