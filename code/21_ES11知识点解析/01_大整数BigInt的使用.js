// ES11之前 max_safe_integer
const maxInt = Number.MAX_SAFE_INTEGER
console.log(maxInt) // 9007199254740991
console.log(maxInt + 1)//9007199254740992
console.log(maxInt + 2)//9007199254740992
console.log(maxInt + 1==maxInt + 2);//true
// ES11之后: BigInt
const bigInt = 900719925474099100n
// console.log(bigInt + 10)
//TypeError: Cannot mix BigInt and other types, use explicit conversions
console.log(bigInt + 10n)

const num = 100
console.log(bigInt + BigInt(num))//转为BigInt

const smallNum = Number(bigInt)
console.log(smallNum)
