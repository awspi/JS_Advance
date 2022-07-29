const clickHandler = () => {
  console.log("window发生了点击")
}

window.addEventListener("click", clickHandler)
window.removeEventListener("click", clickHandler)

window.addEventListener("customEvent", () => {
  console.log("监听到了customEvent")
})

window.dispatchEvent(new Event("customEvent"))
