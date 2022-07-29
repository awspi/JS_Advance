# 16_JSON

JavaScript Object Notation(JavaScript对象符号),JSON是一种非常重要的**数据格式**

**其他的传输格式:** 

- XML:在早期的网络传输中主要是使用XML来进行数据交换的，但是这种格式在解析、传输等各方面都弱于JSON，所以目前已经很
- 少在被使用了;
- Protobuf:另外一个在网络传输中目前已经越来越多使用的传输格式是protobuf，但是直到2021年的3.x版本才支持JavaScript，目前在前端使用的较少;

**使用场景:**

- 网络数据的传输JSON数据;
- 项目的某些配置文件;
- 非关系型数据库(NoSQL)将json作为存储格式;



## JSON基本语法

JSON的顶层支持三种类型的值:

- 简单值:**数字(Number)、字符串(String，不支持单引号)、布尔类型(Boolean)、null类型;**
- 对象值:**由key、value组成，key是字符串类型，并且<u>必须添加双引号</u>，值可以是简单值、对象值、数组值**
- 数组值:**数组的值可以是简单值、对象值、数组值;**

## JSON序列化

某些情况下我们希望将JavaScript中的复杂类型转化成JSON格式的字符串，这样方便对其进行处理:

- 比如我们希望将一个对象保存到localStorage中;
- 但是如果我们直接存放一个对象，这个对象会被转化成 [object Object] 格式的字符串，并不是我们想要的结果;
- ![image-20220729002643201](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207290026235.png)

ES5中引用了JSON全局对象，该对象有两个常用的方法: 

- **`stringify`**方法:将JavaScript类型**转成对应的JSON字符串;** 
- **`parse`**方法:**解析JSON字符串**，转回对应的JavaScript类型;

### Stringify

**JSON.stringify()** 方法将一个 JavaScript 对象或值转换为 JSON 字符串:

```ts
// 1.直接转化
const jsonString1 = JSON.stringify(obj)
//{"name":"why","age":18,"friends":{"name":"kobe"},"hobbies":["篮球","足球"]}
```



#### 参数replace

- 如果指定了一个 replacer 函数，则**可以选择性地替换值**;
- 如果指定的 replacer 是数组，则**可选择性地仅包含数组指定的属性;**

```ts
// 2.stringify第二个参数replacer
// 2.1. 传入数组: 设定哪些是需要转换
const jsonString2 = JSON.stringify(obj, ["name", "friends"])
console.log(jsonString2)
//{"name":"why","friends":{"name":"kobe"}}

// 2.2. 传入回调函数:
const jsonString3 = JSON.stringify(obj, (key, value) => {
  if (key === "age") {
    return value + 1
  }
  return value
})
console.log(jsonString3)
//{"name":"why","age":19,"friends":{"name":"kobe"},"hobbies":["篮球","足球"]}
```

#### 参数space

Adds indentation, white space, and line break characters to the return-value JSON text to **make it easier to read.**

```ts
// 3.stringify第三参数 space
const jsonString4 = JSON.stringify(obj, null, "---")
console.log(jsonString4)
/*
{
---"name": "why",
---"age": 18,
---"friends": {
------"name": "kobe"
---},
---"hobbies": [
------"篮球",
------"足球"
---]
}
*/
```

#### toJSON方法

如果对象本身包含toJSON方法，那么会直接使用toJSON方法的结果:

```ts
const obj = {
  name: "why",
  age: 18,
  friends: {
    name: "kobe",
  },
  hobbies: ["篮球", "足球"],
  toJSON: function() {
    return "123456"
  }
}

const jsonString1 = JSON.stringify(obj)
console.log(jsonString1)
//123456
```



### parse

#### 参数reviver

**JSON.parse()** 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象

- 提供可选的 **reviver** 函数用以**在返回之前对所得到的对象执行变换**(操作)。

```ts
const JSONString =
  '{"name":"why","age":19,"friends":{"name":"kobe"},"hobbies":["篮球","足球"]}'

const info = JSON.parse(JSONString, (key, value) => {
  if (key === "age") {
    return value - 1
  }
  return value
})
console.log(info)
/*
{
  name: 'why',
  age: 18,
  friends: { name: 'kobe' },
  hobbies: [ '篮球', '足球' ]
}
*/

```

## JSON序列化深拷贝

生成的新对象和之前的对象并不是同一个对象,相当于是进行了一次深拷贝;

```ts
const obj = {
  name: "why",
  age: 18,
  friends: {
    name: "kobe",
  },
  hobbies: ["篮球", "足球"],
  foo: function () {
    console.log("foo function")
  },
}

// 将obj对象的内容放到info变量中
// 1.引用赋值
const info = obj
obj.age = 100
console.log(info.age) //100

```

```ts
// 2.浅拷贝
const info2 = { ...obj }
obj.age = 1000
console.log(info2.age) //18
obj.friends.name = "james"
console.log(info2.friends.name)//james
```

```ts
// 3.stringify和parse来实现
const jsonString = JSON.stringify(obj)
console.log(jsonString)//{"name":"why","age":1000,"friends":{"name":"james"},"hobbies":["篮球","足球"]}
const info3 = JSON.parse(jsonString)
obj.friends.name = "curry"
console.log(info3.friends.name)//james
console.log(info3)
/*
{
  name: 'why',
  age: 1000,
  friends: { name: 'james' },
  hobbies: [ '篮球', '足球' ]
}
*/

```

**注意:这种方法它对函数是无能为力的**

- 创建出来的info中是没有foo函数的，这是因为**stringify并不会对函数进行处理;**

