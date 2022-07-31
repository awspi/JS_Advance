const isObject = (value) => {
  const valueType = typeof value
  return value !== null && (valueType === "object" || valueType === "function")
}
//!递归调用
function deepClone(originValue) {
  //?判断是否是一个对象类型
  if (!isObject(originValue)) return originValue
  let newObject = {}
  for (key in originValue) {
    newObject[key] = deepClone(originValue[key])
  }
  return newObject
}

//测试代码
const obj = {
  name: "why",
  age: 18,
  friend: {
    name: "james",
    address: {
      city: "广州",
    },
  },
}

const newObj = deepClone(obj)
console.log(newObj === obj)

obj.friend.name = "kobe"
obj.friend.address.city = "成都"
console.log(newObj)
