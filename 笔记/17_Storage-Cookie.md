# 17_Storage- Cookie

# WebStorage

WebStorage主要提供了一种机制，可以让浏览器提供一种比cookie更直观的key、value存储方式:

- **localStorage**:本地存储，提供的是一种**永久性的存储方法**，在关闭掉网页重新打开时，存储的内容依然保留
- **sessionStorage**:会话存储，提供的是**本次会话的存储**，在关闭掉会话时，存储的内容会被清除;

**sessionStorage**

- 关闭网页后重新打开，sessionStorage会被删除;
- 页面内实现跳转，sessionStorage也会保留;
- 在页面外实现跳转(打开新的网页)**sessionStorage会被删除**

## 方法和属性

**`Storage.length:`**只读属性

- 返回一个整数，表示存储在Storage对象中的数据项数量;

**`Storage.key()`**:该方法接受一个数值**n**作为参数，**返回存储中的第n个key名称;**

**`Storage.getItem()`**:该方法接受一个key作为参数，并且返回key对应的value;

**`Storage.setItem()`**:该方法接受一个key和value，并且将会把key和value添加到存储中。

- 如果key已经存在，则更新其对应的值;

**`Storage.removeItem():`**该方法接受一个key作为参数，并把该key从存储中删除

**`Storage.clear()`**:该方法的作用是清空存储中的所有key;

## 封装

```ts
class LocalCache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage : sessionStorage
  }

  setItem(key, value) {
    if (value) {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

  getItem(key) {
    let value = this.storage.getItem(key)
    if (value) {
      value = JSON.parse(value)
      return value
    }
  }

  removeItem(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }

  key(index) {
    return this.storage.key(index)
  }

  length() {
    return this.storage.length
  }
}

const localCache = new LocalCache()
const sessionCache = new LocalCache(false)

export { localCache, sessionCache }

```

# IndexedDB

 IndexedDB是一种底层的API，用于在客户端存储大量的结构化数据.

- 它是一种事务型数据库系统，是一种基于JavaScript面向对象数据库，有点类似于NoSQL(非关系型数据库);
- IndexDB本身就是基于事务的，我们只需要指定数据库模式，打开与数据库的连接，然后检索和更新一系列事务即可;

## 连接数据库

1. 打开indexDB的某一个数据库; 通过`indexDB.open(数据库名称, 数据库版本)方法;` 
   - 如果数据库不存在，那么会创建这个数据;
2. 通过监听回调得到数据库连接结果;

数据库的open方法会得到一个**IDBOpenDBRequest**类型

我们可以通过下面的三个回调来确定结果:

- onerror:当数据库连接失败时;
- **onsuccess**:当数据库连接成功时回调;
  - 通过onsuccess回调的event获取到db对象:event.target.result
- onupgradeneeded:第一次打开/或者版本发生升级
  - 通常在这里会创建具体的存储对象:db.createObjectStore(存储对象名称, { keypath: 存储的主键 })

```ts
// 打开数据(和数据库建立连接)
const dbRequest = indexedDB.open("why", 3)
dbRequest.onerror = function(err) {
  console.log("打开数据库失败~")
}
let db = null
dbRequest.onsuccess = function(event) {
  db = event.target.result
}
// 第一次打开/或者版本发生升级
dbRequest.onupgradeneeded = function(event) {
  const db = event.target.result
  console.log(db)
  // 创建一些存储对象
  db.createObjectStore("users", { keyPath: "id" })//主键
}
```

## 数据库操作

对数据库的操作要通过事务对象来完成

1. 通过db获取对应存储的事务 **`db.transaction(存储名称, 可写操作)`**
2. 通过事务获取对应的存储对象 **`transaction.objectStore(存储名称);`**

```ts
    const transaction = db.transaction("users", "readwrite")
    console.log(transaction)
    const store = transaction.objectStore("users")
```

新增数据 **`store.add`**

查询数据

-  **`store.get(key)`**
- 通过 **store.openCursor** 拿到游标对象 `request = store.openCursor()`
  - 在**request.onsuccess**中获取**cursor**: **`event.target.result`**
    - 获取对应的key**`:cursor.key`**;
    - 获取对应的value:**`cursor.value`**;
    - 可以通过cursor.continue来继续执行;

```ts
// 1.查询方式一(知道主键, 根据主键查询)
const request = store.get(102)
request.onsuccess = function(event) {
  console.log(event.target.result)
}
// 2.查询方式二:
const request = store.openCursor()
request.onsuccess = function (event) {
  const cursor = event.target.result
  if (cursor) {
    if (cursor.key === 101) {
      console.log(cursor.key, cursor.value)
    } else {
      cursor.continue()//指向下一个
    }
  } else {
    console.log("查询完成")
  }
}
```

修改数据 **`cursor.update(value)`**

```ts
console.log("点击了修改")
const updateRequest = store.openCursor()
updateRequest.onsuccess = function (event) {
  const cursor = event.target.result
  if (cursor) {
    if (cursor.key === 101) {
      const value = cursor.value
      value.name = "curry"
      cursor.update(value)
    } else {
      cursor.continue()
    }
  } else {
    console.log("查询完成")
  }
}
```

删除数据 **`cursor.delete()`**

```ts
console.log("点击了删除")
const deleteRequest = store.openCursor()
deleteRequest.onsuccess = function (event) {
  const cursor = event.target.result
  if (cursor) {
    if (cursor.key === 101) {
      cursor.delete()
    } else {
      cursor.continue()
    }
  } else {
    console.log("查询完成")
  }
}
```



# Cookie

某些网站为了辨别用户身份而存储在用户本地终端(Client Side)上的数据。

Cookie总是保存在客户端中，按在客户端中的存储位置，Cookie可以分为内存Cookie和硬盘Cookie

- 内存Cookie由浏览器维护，保存在内存中，浏览器关闭时Cookie就会消失，其存在时间是短暂的
- 硬盘Cookie保存在硬盘中，有一个过期时间，用户手动清理或者过期时间到时，才会被清理;

判断一个cookie是内存cookie还是硬盘cookie

- 没有设置过期时间，**默认情况下cookie是内存cookie**，在关闭浏览器时会自动删除;
- **有设置过期时间，并且过期时间不为0或者负数的cookie，是硬盘cookie**，需要手动或者到期时，才会删除;



## 常见属性

**cookie的生命周期:**

默认情况下的cookie是内存cookie，也称之为**会话cookie**，也就是在浏览器关闭时会自动被删除;

我们可以**通过设置expires或者max-age来设置过期的时间;**

- **expires**:设置的是Date.toUTCString()，设置格式是;expires=date-in-GMTString-format
- **max-age:**设置过期的秒钟，;max-age=max-age-in-seconds (例如一年为60*60*24*365),会自动转成expires

**cookie的作用域:(允许cookie发送给哪些URL)**

**Domain**:指定哪些主机可以接受cookie

- 如果不指定，那么默认是 origin，不包括子域名。
- 如果指定Domain，则包含子域名。例如，如果设置 `Domain=mozilla.org`，则 Cookie 也包含在子域名中(如developer.mozilla.org)。

**Path**:指定主机下哪些路径可以接受cookie

- 例如，设置 Path=/docs，则以下地址都会匹配:

  - /docs

  - /docs/Web/

  - /docs/Web/HTTP

## 客户端设置cookie

 js直接设置和获取cookie:`documnet.cookie="name='pithy'"` 

- 这个cookie会在会话关闭时被删除掉;
- **js不能**获取服务器传来的cookie

设置cookie，同时设置过期时间(默认单位是秒钟)

![image-20220729140727646](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207291407692.png)

