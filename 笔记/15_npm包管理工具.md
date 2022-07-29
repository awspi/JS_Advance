# 15_包管理工具

# NPM包管理器

Node Package Manager,Node包管理器;目前已经不仅仅是Node包管理器了，在前端项目中我们也在使用它来管理依赖的包;

## 配置文件package.json

- 方式一:手动从零创建项目，npm init –y
- 方式二:通过脚手架创建项目，脚手架会帮助我们生成package.json，并且里面有相关的配置

![image-20220728142916527](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207281429570.png)

### 常见的属性

**必须填写的属性:name、version**

- name是项目的名称;
- version是当前项目的版本号;
- description是描述信息，很多时候是作为项目的基本描述;
- author是作者相关信息(发布时用到);
- license是开源协议(发布时用到);

**private属性:**

- private属性记录当前的项目是否是私有的;
- 当值为true时，npm是不能发布它的，这是防止私有项目或模块发布出去的方式;

**main属性:**

 设置程序的入口,和webpack打包的入口并不冲突,它是在你发布一个模块的时候会用到的;

**scripts属性**

- scripts属性用于配置一些脚本命令，以键值对的形式存在

-  配置后我们可以通过 npm run 命令的key来执行这个命令

- `npm start`和`npm run start`的区别是什么?

  - 它们是**等价的;**

  - 对于常用的 start、 test、stop、restart可以省略掉run直接通过 npm start等方式运行;

**dependencies属性**

- **dependencies**属性是指定**无论开发环境还是生成环境都需要依赖的包;**
- 通常是我们**项目实际开发**用到的一些库模块vue、vuex、vue-router、react、react-dom、axios等等
- 与之对应的是devDependencies;

**devDependencies属性**

- 一些包**在生成环境是不需要的**，比如webpack、babel等;
- 这个时候我们会通过 npm install webpack --save-dev，将它安装到devDependencies属性中;

**peerDependencies属性**

- 还有一种项目依赖关系是对等依赖，也就是你依赖的一个包，它**必须是以另外一个宿主包为前提的**
- 比如element-plus是依赖于vue3的，ant design是依赖于react、react-dom;

**engines属性**

- engines属性用于指定Node和NPM的版本号;
- 在安装的过程中，会先检查对应的引擎版本，如果不符合就会报错
- 事实上也可以指定所在的操作系统 "os" : [ "darwin", "linux" ]，只是很少用到;

**browserslist属性**

- 用于配置打包后的JavaScript浏览器的兼容情况
- 否则我们需要手动的添加polyfills来让支持某些语法;
- 也就是说它是为webpack等打包工具服务的一个属性

### 依赖的版本管理

semver版本规范是X.Y.Z:

- X**主版本号**(major):当你做了不兼容的 API 修改(可能不兼容之前的版本);
- Y**次版本号**(minor):当你做了向下兼容的功能性新增(新功能增加，但是兼容之前的版本)
-  Z修订号(patch):当你做了向下兼容的问题修正(没有新功能，修复了之前版本的bug);

**`^`和`~`的区别:**

-  ^x.y.z:表示**x是保持不变**的，y和z永远安装最新的版本;
-  ~x.y.z:表示**x和y保持不变**的，z永远安装最新的版本;

## package-lock.json文件解析

**name**:项目的名称;

**version**:项目的版本;

**lockfileVersion**:lock文件的版本;

**requires**:使用requires来跟踪**模块的依赖关系;**

**dependencies**:项目的依赖

![image-20220728151807653](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207281518696.png)

## npm install 命令

项目安装会在当前目录下生产一个 node_modules 文件夹

- 全局安装(global install): `npm install webpack -g`
- 项目(局部)安装(local install): `npm install webpack`

### **全局安装**

全局安装是直接将某个包安装到全局: 

- 比如yarn的全局安装:  `npm install webpack -g`

- 使用npm<u>全局安装</u>的包都是一些**工具包**:yarn、webpack等,而不是类似于 axios、express、koa等库文件
- 全局安装了之后并不能让我们在所有的项目中使用 axios等库;

### 局部安装

**局部安装**分为**开发时依赖**和**生产时依赖**:

**安装开发和生产依赖** 

- `npm install axios` 
- `npm i axios`

**开发依赖**

- `npm install webpack --save-dev` 
- `npm install webpack -D`
- `npm i webpack –D`

**根据package.json中的依赖包**

-  `npm install`

### ⚙️npm install 原理

![image-20220728150856668](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207281508702.png)

**npm install会检测是有package-lock.json文件:** 

**没有lock文件**

- 分析依赖关系，这是因为我们可能包会依赖其他的包，并且多个包之间会产生相同依赖的情况;
- 从registry仓库中下载压缩包(如果我们设置了镜像，那么会从镜像服务器下载压缩包);
- 获取到压缩包后会对压缩包进行缓存(从npm5开始有的);
- 将压缩包解压到项目的node_modules文件夹中(require的查找顺序会在该包下面查找)

**有lock文件**

- 检测lock中包的版本是否和package.json中一致(会按照semver版本规范检测);
- 不一致，那么会重新构建依赖关系，直接会走顶层的流程;
- 一致的情况下，会去优先查找缓存
  - 没有找到，会从registry仓库下载，直接走顶层流程;
  - 查找到，会获取缓存中的压缩文件，并且将压缩文件解压到node_modules文件夹中;

## npm其他命令

**卸载某个依赖包:**

- `npm uninstall package`
- `npm uninstall package --save-dev`
- `npm uninstall package -D`

**强制重新build**

- `npm rebuild`

**清除缓存**

- `npm cache clean`

**更多的命令** https://docs.npmjs.com/cli-documentation/cli 



## 局部命令的执行

案例:那么如何使用项目(局部)的webpack，常见的是两种方式: 

**方式一:明确查找到node_module下面的webpack**

- 在终端中使用如下命令(在项目根目录下) 

- ```bash
  ./node_modules/.bin/webpack --version
  ```

**方式二:在 scripts定义脚本，来执行webpack;**

- 修改package.json中的scripts

- ```json
     "scripts": {
        "webpack": "webpack --version"
        }
  ```

**方式三:使用npx**

- ```bash
   npx webpack --version
  ```



## npx工具

npx是npm5.2之后自带的一个命令。

npx的作用非常多，但是比较常见的是**使用它来调用项目中的某个模块的指令。**

npx的原理非常简单，**它会到当前目录的node_modules/.bin目录下查找对应的命令;**

# yarn工具

yarn 是为了弥补 npm 的一些缺陷而出现的;虽然从npm5版本开始，进行了很多的升级和改进，但是依然很多人喜欢使用yarn;

![image-20220728235759149](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207282357198.png)



# cnpm工具

**npm设置镜像:**

查看npm镜像:

```bash
npm config get registry # npm config get registry 
```

我们可以直接设置npm的镜像:

```bash
npm config set registry https://registry.npm.taobao.org
```

**cnpm** 不修改npm的镜像

可以使用cnpm，并且将cnpm设置为淘宝的镜像:

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org 
cnpm config get registry # https://r.npm.taobao.org/
```

# 发布包 

**注册 npm 账号**

### **登录** **npm** **账号**

npm 账号注册完成后，可以在终端中执行 npm login 命令，依次输入用户名、密码、邮箱后，即可登录成功。

- 注意:在运行 `npm login` 命令之前，必须 先把下包的服务器地址切换为 npm 的官方 服务器。否则会导致发布包失败!

### **把包发布到 npm 上**

将终端**切换到包的根目录之后**，运行 `npm publish` 命令，即可将包发布到 npm 上(注意:包名不能雷同)。

![image-20220603102915061](https://wsp-typora.oss-cn-hangzhou.aliyuncs.com/images/202207261553758.png)

### **删除已发布的包**

运行 `npm unpublish 包名 --force` 命令，即可从 npm 删除已发布的包。

注意:

- npm unpublish 命令只能删除 72 小时以内发布的包
- npm unpublish 删除的包，在 24 小时内不允许重复发布