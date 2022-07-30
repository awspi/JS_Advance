function divClick() {
  console.log("div元素被点击2")
}

const divEl = document.querySelector(".box")
// DOM0
divEl.onclick = function () {
  console.log("div元素被点击( 覆盖之前的onclick属性)")
}

// DOM2 addEventListener不会覆盖
divEl.addEventListener("click", () => {
  console.log("div元素被点击4")
})
divEl.addEventListener("click", () => {
  console.log("div元素被点击5")
})
divEl.addEventListener("click", () => {
  console.log("div元素被点击6")
})
