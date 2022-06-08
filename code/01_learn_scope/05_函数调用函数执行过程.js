var message = "Hello Global"

function foo() {
  console.log(message)//Hello Global
}

function bar() {
  var message = "Hello Bar"
  foo()
}

bar()
