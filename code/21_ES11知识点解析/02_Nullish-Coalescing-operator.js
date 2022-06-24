// ES11: 空值合并运算 ??

const foo = undefined
const bar1 = foo || "default value"
console.log(bar1)
//逻辑或 如何前面的true就不进行后面的运算 缺点:0 空字符串
//如果foo为undefined 显示后一项


const bar2 = foo ?? "defualt value" 
//明确判断是否为undefined或null

console.log(bar2)

// ts 是 js 的超级
