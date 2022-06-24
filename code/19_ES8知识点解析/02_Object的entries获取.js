const obj = {
  name: "why",
  age: 18
}

console.log(Object.entries(obj))

const objEntries = Object.entries(obj)

objEntries.forEach(item => {
  console.log(item[0], item[1])
  //name why
  // age 18
})

let arr=["abc", "cba", "nba"]
const arrEntries=Object.entries(arr)
//把索引值当key 数组元素当val
console.log(arrEntries)//[ [ '0', 'abc' ], [ '1', 'cba' ], [ '2', 'nba' ] ]

console.log(Object.entries("abc"))////把索引值当key str当val

