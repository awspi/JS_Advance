const names = ["abc", "cba", "nba", "mba", NaN,undefined]

if (names.indexOf("cba") !== -1) {
  console.log("包含abc元素")
}

// ES7 ES2016
if (names.includes("cba", 2)) {//true
  console.log("包含abc元素")
}

if (names.indexOf(NaN) !== -1) { //true
  console.log("包含NaN")
}

if (names.includes(NaN)) {//false
  console.log("包含NaN")
}
if (names.includes(undefined)) {//false
  console.log("包含un")
}
