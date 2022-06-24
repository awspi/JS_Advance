const obj = {
  name: "why",
  age: 18
}

console.log(Object.keys(obj))//[ 'name', 'age' ]
console.log(Object.values(obj))//[ 'why', 18 ]

// 用的非常少
console.log(Object.values(["abc", "cba", "nba"]))//[ 'abc', 'cba', 'nba' ]
console.log(Object.values("abc"))//[ 'a', 'b', 'c' ]
                                      