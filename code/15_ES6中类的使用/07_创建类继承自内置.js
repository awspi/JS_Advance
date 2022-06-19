// class Person {

// }

// class Student extends Person {

// }

class myArray extends Array {
  firstItem() {
    return this[0]
  }

  lastItem() {
    return this[this.length-1]
  }
}

var arr = new myArray(1, 2, 3)
console.log(arr.firstItem())
console.log(arr.lastItem())
