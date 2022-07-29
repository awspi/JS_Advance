const RELATIONS = {
  a: "A",
  b: "B",
  c: "C",
  D: "D",
}

let name = ""
const foo = (raw) => {
  Object.keys(RELATIONS).forEach((item) => {
    if (item === raw) {
      name = RELATIONS[item]
    }
  })
}
foo("a")
console.log(name) //A
