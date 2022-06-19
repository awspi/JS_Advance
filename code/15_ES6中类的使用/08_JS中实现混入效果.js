class Person {
  say(){
    console.log('person');
  }
}
class Coder{
  code(){
    console.log('coding');
  }
}
// 在JS中类只能有一个父类: 单继承
class Student extends Person {
  study(){
    console.log('study');
  }
}

function mixin(BaseClass){
  return class extends BaseClass{
    code(){
      console.log('coding');
    }
  }
}

var studentCoder=mixin(Student);
var scoder=new studentCoder();
scoder.say();
scoder.study();
scoder.code();



// function mixinRunner(BaseClass) {
//   class NewClass extends BaseClass {
//     running() {
//       console.log("running~")
//     }
//   }
//   return NewClass
// }

// function mixinEater(BaseClass) {
//   return class extends BaseClass {
//     eating() {
//       console.log("eating~")
//     }
//   }
// }

// var NewStudent = mixinEater(mixinRunner(Student))
// var ns = new NewStudent()
// ns.running()
// ns.eating()
