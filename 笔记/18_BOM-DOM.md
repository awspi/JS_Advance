# 17_BOM-DOM

# BOM

浏览器的对象模型(BOM，Browser Object Model)。

BOM主要包括一下的对象模型:

- window:包括全局属性、方法，控制浏览器窗口相关的属性、方法;
- location:浏览器连接到的对象的位置(URL);
- history:操作浏览器的历史;
- document:当前窗口操作文档的对象;



## Window

window对象在浏览器中有两个身份: 

**全局对象**

- 我们知道ECMAScript其实是有一个全局对象的，这个全局对象在Node中是global;
- 在浏览器中就是window对象

在浏览器中，window对象就是之前经常提到的全局对象，也就是我们之前提到过GO对象:

- 比如在全局通过var声明的变量，会被添加到GO中，也就是会被添加到window上;
- 比如window默认给我们提供了全局的函数和类:setTimeout、Math、Date、Object等;
- 通过var声明的变量，全局提供的类和方法

**浏览器窗口对象。**

- 作为浏览器窗口时，提供了对浏览器操作的相关的API;

事实上window对象上肩负的重担是非常大的: 

- 第一:包含大量的**属性**，localStorage、console、location、history、screenX、scrollX等等(大概60+个属性); 

- 第二:包含大量的**方法**，alert、close、scrollTo、open等等(大概40+个方法);

- 第三:包含大量的**事件**，focus、blur、load、hashchange等等(大概30+个事件);

- 第四:包含从`EventTarget`继承过来的方法，addEventListener、removeEventListener、**dispatchEvent**方法;

  - ```ts
    //从`EventTarget`继承过来的方法
    const clickHandler = () => {
      console.log("window发生了点击")
    }
    
    window.addEventListener("click", clickHandler)
    window.removeEventListener("click", clickHandler)
    
    window.addEventListener("customEvent", () => {
      console.log("监听到了customEvent")
    })
    
    window.dispatchEvent(new Event("customEvent"))//主动派发事件
    
    ```

    

 MDN文档:https://developer.mozilla.org/zh-CN/docs/Web/API/Window

### 属性

<img src="https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207291435963.png" alt="image-20220729143550943" style="zoom:50%;" />

### 方法

<img src="https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207291435287.png" alt="image-20220729143543251" style="zoom:50%;" />

### 事件

<img src="https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207291436513.png" alt="image-20220729143626480" style="zoom:50%;" />

### EventTarget

Window继承自EventTarget，所以会继承其中的属性和方法:

https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget

- `addEventListener`:注册某个事件类型以及事件处理函数;
- `removeEventListener`:移除某个事件类型以及事件处理函数;
- `dispatchEvent`:派发某个事件类型到EventTarget上;

**默认事件监听**https://developer.mozilla.org/zh-CN/docs/Web/Events

![image-20220729150758207](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207291507256.png)

## Location

Location对象用于表示window上当前链接到的URL信息。

![image-20220729151649725](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207291516763.png)

### 属性

- href: 当前window对应的超链接URL, 整个URL; pprotocol: 当前的协议;
- host: 主机地址;
- hostname: 主机地址(不带端口);
- port: 端口;
- pathname: 路径;
- search: 查询字符串;
- hash: 哈希值;

### 方法

- **assign**:赋值一个新的URL，并且跳转到该URL中;
- **replace**:打开一个新的URL，并且跳转到该URL中(不同的是不会在浏览记录中留下之前的记录)
- **reload**:重新加载页面，可以传入一个Boolean类型;

## history

history对象允许我们访问浏览器曾经的会话历史记录。

### 属性

- length:会话中的记录条数
- state:当前保留的状态值;

### 方法:

- **back()**:返回上一页，等价于history.go(-1);
- **forward()**:前进下一页，等价于history.go(1);
- **go()**:加载历史中的某一页;
- **pushState(state, title[, url])**:打开一个指定的地址,(不跳转网页)  方法向当前浏览器会话的历史堆栈中添加一个状态  vue3 router相关
  - [https://developer.mozilla.org/zh-CN/docs/Web/API/History_API#pushstate_%E6%96%B9%E6%B3%95%E7%9A%84%E4%BE%8B%E5%AD%90](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState#语法)
- **replaceState():**打开一个新的地址，并且使用replace;

```ts
const jumpBtn = document.querySelector("#jump")

jumpBtn.onclick = function() {
  // location.href = "./demo.html"

  // 跳转(不刷新网页)
  history.pushState({name: "pithy"}, "", "/detail")
  // history.replaceState({name: "coderwhy"}, "", "/detail")
  console.log(history.state)
}

```



# DOM

浏览器是用来展示网页的，而网页中最重要的就是里面各种的标签元素，JavaScript很多时候是需要操作这些元素的

![image-20220729235049795](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207292350841.png)

- JavaScript如何操作元素呢?通过Document Object Model(DOM，文档对象模型)。
- DOM给我们提供了一系列的模型和对象，让我们可以方便的来操作Web页面。

## EventTarget

- 因为继承自**EventTarget**，所以也可以使用EventTarget的方法:

```ts
document.addEventListener("click", () => {
  console.log("document被点击")
})

const divEl = document.querySelector("#box")
const spanEl = document.querySelector(".content")

divEl.addEventListener("click", () => {
  console.log("div元素被点击")
})

spanEl.addEventListener("click", () => {
  console.log("span元素被点击")
})

```



## Node节点

所有的DOM节点类型都继承自Node接口。https://developer.mozilla.org/zh-CN/docs/Web/API/Node

![image-20220730125512873](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207301255910.png)

Node有几个非常重要的属性:

- **nodeName**:node节点的名称
- **nodeType**:可以区分节点的类型 
- **nodeValue**:node节点的值;
- **childNodes**:所有的子节点;

```ts
const divEl = document.querySelector("#box")
const spanEl = document.querySelector(".content")

// 常见的属性
console.log(divEl.nodeName, spanEl.nodeName) //div,span
console.log(divEl.nodeType, spanEl.nodeType) //1 ,1 节点类型
console.log(divEl.nodeValue, spanEl.nodeValue) //null null

// childNodes
const spanChildNodes = spanEl.childNodes
const textNode = spanChildNodes[0]
console.log(textNode.nodeValue) //span元素

// 常见的方法
const strongEl = document.createElement("strong")
strongEl.textContent = "我是strong元素"
divEl.appendChild(strongEl)

// 注意事项: document对象不能直接appendChild 要在body里加
document.body.appendChild(strongEl)

```



## Document

![image-20220730130054788](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207301300817.png)

Document节点表示的整个载入的网页

```ts
// 常见的属性
console.log(document.body)
console.log(document.title)
document.title = "Hello World"

console.log(document.head)
console.log(document.children[0])

console.log(window.location)
console.log(document.location)
console.log(window.location === document.location)

// 常见的方法
// 创建元素
const imageEl = document.createElement("img")
const imageEl2 = new HTMLImageElement()

// 获取元素
const divEl1 = document.getElementById("box")
const divEl2 = document.getElementsByTagName("div")
const divEl3 = document.getElementsByName("title")
const divEl4 = document.querySelector(".content")
const divEl5 = document.querySelectorAll(".content")

```



## Element

我们平时创建的div、p、span等元素在DOM中表示为Element元素，我们来看一下常见的属性和方法:

```ts
const divEl = document.querySelector("#box")


// 常见的属性
console.log(divEl.id)
console.log(divEl.tagName)
console.log(divEl.children)
console.log(divEl.className)
console.log(divEl.classList)
console.log(divEl.clientWidth)
console.log(divEl.clientHeight)
console.log(divEl.offsetLeft)
console.log(divEl.offsetTop)

// 常见的方法
const value = divEl.getAttribute("age") //getAttribute获取属性
console.log(value)
divEl.setAttribute("height", 1.88)//setAttribute设置属性

```



# 事件监听

前面我们讲到了JavaScript脚本和浏览器之间交互时，浏览器给我们提供的BOM、DOM等一些对象模型。

事实上还有一种需要和浏览器经常交互的事情就是事件监听:

浏览器在某个时刻可能会发生一些事件，比如鼠标点击、移动、滚动、获取、失去焦点、输入内容等等一系列 的事件;

我们需要以某种方式(代码)来对其进行响应，进行一些事件的处理;

在Web当中，事件在浏览器窗口中被触发，并且通过绑定到某些元素上或者浏览器窗口本身

那么我们就可以**给这些元素或者window窗口来绑定事件的处理程序，来对事件进行监听。**

**如何进行事件监听呢?**

- 监听方式一:在script中直接监听;
- 监听方式二:通过元素的on来监听事件;
- 监听方式三:通过EventTarget中的addEventListener来监听;

![image-20220730132134422](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207301321458.png)

## 事件冒泡和事件捕获

默认情况下事件是从**最内层的向外**依次传递的顺序，这个顺序我们称之为**事件冒泡(Event Bubble)。**

另外一种监听事件流的方式就是从**外层到内层**，这种称之为**事件捕获(Event Capture);**

![image-20220730133655401](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207301336439.png)

## 事件对象event

当一个事件发生时，就会有和这个事件相关的很多信息:

比如事件的类型是什么，你点击的是哪一个元素，点击的位置是哪里等等相关的信息,这些信息会被封装到一个Event对象中;

该对象给我们提供了想要的一些属性，以及可以通过该对象进行某些操作;

常见的属性:

- **type**:事件的类型:`click...`
- **target**:当前事件发生的元素 `<span>123 <span>`
- **currentTarget**:**当前**处理事件的元素 ,事件冒泡时,为被点击的那个元素
- **offsetX、offsetY**:点击元素的位置;

常见的方法:

- **preventDefault**:取消事件的默认行为;
- **stopPropagation**:阻止事件的进一步传递

```ts
const spanEl = document.querySelector(".span")

spanEl.addEventListener("click", (event) => {
  console.log("span元素被点击:", event)
  console.log("事件的类型:", event.type)
  console.log("事件的元素:", event.target, event.currentTarget)
  console.log("事件发生的位置:", event.offsetX, event.offsetY)
})

const divEl = document.querySelector(".container")
divEl.addEventListener("click", (event) => {
  console.log("div元素被点击:", event.target, event.currentTarget)
})

// 常见的方法
// preventDefault
const aEl = document.querySelector("a")	
aEl.addEventListener("click", (event) => {
  event.preventDefault()
})

// stopPropagation

```

