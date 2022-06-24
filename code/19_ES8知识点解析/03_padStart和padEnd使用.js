const message = "Hello World"

const newMessage = message.padStart(15, "*").padEnd(20, "-")
console.log(newMessage)//****Hello World-----

// 案例
const cardNumber = "322222222222222222"
const lastFourCard = cardNumber.slice(-4)//2222
const finalCard = lastFourCard.padStart(cardNumber.length, "*")
console.log(finalCard)//**************2222
