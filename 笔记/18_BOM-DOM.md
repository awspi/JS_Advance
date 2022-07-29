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



## 